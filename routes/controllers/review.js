const rootdir = require("../../modules/path");
const { body, validationResult } = require("express-validator");
const { NodeResolveLoader } = require("nunjucks");
const { hash } = require("bcrypt");
const { Hash_info, HashTop_update, insert_review, insert_hashtag, update_auth, add_career, update_review_likes, check_career, update_career, mypage_review_info, update_review, update_hashtag } = require("../../modules/sql");
const review = require("../middleware/review");


process.on('uncaughtException', (err)=>{
  console.error(err)
})

module.exports = {
  write: async (req, res) => {
    const contents = {
      Corp_name : req.params.name,
      user_id : req.user.id,
      nickname : req.user.nickname,
      first_date : req.body.first_date,
      last_date : req.body.last_date,
      type : req.body.work_type,
      growth_score : parseInt(req.body.growth)/2,
      leadership_score : parseInt(req.body.leadership)/2,
      reward_score : parseInt(req.body.reward)/2,
      worth_score : parseInt(req.body.worth)/2,
      culture_score : parseInt(req.body.culture)/2,
      worklife_score : parseInt(req.body.worklife)/2,
      highlight : req.body.highlight,
      pros : req.body.pros,
      cons : req.body.cons,
    }
    const isEmpty = (object) => !Object.values(object).every(x=> (x !== null && x !== ''));
    if(isEmpty(contents)){
      return res.status(400).json({"msg":"입력누락"})
    }
    const hashtag = {};
    for (let i = 1; i<=16; i++){
      const key = `hashtag_${i}`;
      const value = req.body[`hash_${i}`];
      hashtag[key] = value;
    }
    try {
      //기관리뷰 create
      const insertReview = await insert_review(contents);
      const review_no = insertReview.insertId;
      //해시태그 create
      const insertHashtag = await insert_hashtag(contents, review_no, hashtag);
      //해시태그 가져오기
      const hashTopList = await Hash_info(contents.Corp_name);
      //해시태그 TOP4 업데이트
      const hashUpdate_result = await HashTop_update(contents.Corp_name, hashTopList);
      //권한 업데이트
      const updateAuth = await update_auth(contents);
      return res.status(200).send("<script>alert('소중한 후기 감사합니다.');location.href = '/review/corp/"+contents.Corp_name+"';</script>");
    } catch(err){
      console.log(err)
      return res.status(500).json({err});
    }
  },
  write_auth: (req, res) => {
    const middle_info = {
      User: req.user,
      Corp: req.corp,
      hash: req.hash,
      Type: req.careerType
    }
    if (middle_info.User) {
      if (middle_info.Corp){
        res.status(200).render(rootdir+'/public/write_detail.html', middle_info)
      }else{
        return res.status(404).send("<script>alert('아직 등록되지 않은 기관이므로, 기관정보를 먼저 알려주세요.');history.go(-1);</script>");
      }
    }
    else {
      return res.status(401).send("<script>alert('로그인 하신 후 이용할 수 있는 서비스입니다.');location.href = '/login';</script>");
    }
  },
  review_detail: (req, res) => {
    let cnt = true
    if(req.corp !== undefined){
      if(req.corp.cnt == 0){
        cnt = false
      }
      const middle_info = {
        User: req.user,
        Corp: req.corp,
        hash: req.hash,
        content: req.content[0],
        cnt : cnt,
        // top10 : req.top10
      }
      return res.status(200).render(rootdir+'/public/review_detail.html', middle_info)
    } else{
      return res.status(404).render(rootdir+'/public/404.html')
    }
  },
  review_more: (req, res) => {
    const User = req.user
    const content = req.content;
    const perPage = 3;
    const curpage = req.query.page;
    const startIndex = curpage * perPage - 2;
    const endIndex = startIndex + perPage;
    const newContents = content.slice(startIndex, endIndex)
    if(User){
      if(User.auth > 0){
        res.status(200).json({auth: User.auth, content: newContents})
      }
      else{
        res.status(204).json({auth: '권한 필요'})
      }
    }
    else {
      res.status(200).json({auth: 'none'})
    }
  },
  review_likes: async (req, res) => {
    const User = req.user
    if (User) {
      const corp_name = req.body.name
      const review_num = req.body.num
      const review_like = req.body.likes
      const updateRviewLikes = await update_review_likes(corp_name, review_num, review_like);
      if(updateRviewLikes !== undefined){
        return res.status(200).send(JSON.stringify(req.user))
      }else{
        return res.status(500).json({err})
      }
    } else {
      return res.status(200).send(JSON.stringify("권한없음"));
    }
  },
  con_top10_detail: (req, res)=>{
    if(req.tf){
      return res.send(JSON.stringify(req.detail10))
    }else{
      throw err;
    }
  },
  con_review_search: (req, res)=>{
    let cityArray;
    if(!req.query.city == 0){
      cityArray = req.query.city.split(',');
    };
    let scoreArray;
    if(!req.query.score==0){
      scoreArray = req.query.score.split(',');
    }
    const data = {
      User: req.user,
      Corp_data: req.corp_data,
      Order: req.query.order,
      Page: req.query.page,
      Count: req.totalDataCnt,
      City: cityArray,
      Score: scoreArray,
      Hashtag: req.query.hashtag,
    }
    if(data.Count !== undefined){res.cookie('totalCount', data.Count)};
    res.status(200).render(rootdir+'/public/review_search.html', data);
  },
  con_mypage_review: async (req, res)=>{
    const User = req.user.id;
    if(User){
      const reviews = await mypage_review_info(User)
      const data = {
        User: req.user,
        reviews: reviews
      }
      res.status(200).render(rootdir+'/public/mypage_review.html', data);
    }else{
      res.status(401).send("<script>alert('로그인 하신 후 이용할 수 있는 서비스입니다.');location.href = '/login';</script>");
    }
  },
  con_mypage_review_edit: (req,res)=>{
    const data = {
      User: req.user,
      Review: req.review,
      Corp: req.corp,
      Type: req.careerType
    }
    if(data.User){
      if(data.User.nickname == data.Review.nickname){
        res.status(200).render(rootdir+'/public/modify_review.html', data);
      }else{
        res.status(401).send("<script>alert('잘못된 접근입니다.');location.href = '/mypage/profile';</script>");
      }
    }else{
      res.status(401).send("<script>alert('로그인 하신 후 이용할 수 있는 서비스입니다.');location.href = '/login';</script>");
    }
  },
  con_review_modify: async (req, res)=>{
    let contents = {
      Corp_name : req.body.Corp_name,
      review_no : req.body.review_no,
      user_id : req.user.id,
      nickname : req.user.nickname,
      first_date : req.body.first_date,
      last_date : req.body.last_date,
      type : req.body.work_type,
      growth_score : parseInt(req.body.growth)/2,
      leadership_score : parseInt(req.body.leadership)/2,
      reward_score : parseInt(req.body.reward)/2,
      worth_score : parseInt(req.body.worth)/2,
      culture_score : parseInt(req.body.culture)/2,
      worklife_score : parseInt(req.body.worklife)/2,
      highlight : req.body.highlight,
      pros : req.body.pros,
      cons : req.body.cons,
    }
    const addvalue = ((contents.growth_score + contents.leadership_score + contents.reward_score + contents.worth_score + contents.culture_score + contents.worklife_score)/6);
    contents["total_score"] = addvalue;
    const isEmpty = (object) => !Object.values(object).every(x=> (x !== null && x !== ''));
    if(isEmpty(contents)){
      return res.status(400).json({"msg":"입력누락"})
    }
    const hashtag = {};
    for (let i = 1; i<=16; i++){
      const key = `hashtag_${i}`;
      const value = req.body[`hash_${i}`];
      hashtag[key] = value;
    }
    try {
      //기관리뷰 update
      const upadteReview = await update_review(contents);
      //해시태그 update
      const updateHashtag = await update_hashtag(contents.review_no, hashtag);
      //해시태그 가져오기
      const hashTopList = await Hash_info(contents.Corp_name);
      //해시태그 TOP4 업데이트
      const hashUpdate_result = await HashTop_update(contents.Corp_name, hashTopList);
      return res.status(200).send("<script>alert('리뷰가 수정되었습니다.');location.href = '/mypage/review';</script>");
    } catch(err){
      console.log(err)
      return res.status(500).json({err});
    }
  },
  deleteReview: (req, res) => {
    if(res.result.affectedRows == 1){
      return res.status(200).send("삭제완료");
    } else{
      return res.status(400).send("삭제불가");
    }
  },
}


      
