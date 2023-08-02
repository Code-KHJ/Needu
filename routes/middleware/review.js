const { review_content, review_recent, review_search_result, review_search_result_cnt, select_auth, mypage_review_edit } = require('../../modules/sql');
const rootdir = require("../../modules/path");


module.exports = {
  review_content: async (req, res, next) => {
    const Corp_name = req.params.name;
    try{
      const content = await review_content(Corp_name);
      if (content !== null){
        req.content = content;
        next();
      } else {
        next();
      }  
    } catch(err){
      console.error(err)
    }
  },
  review_auth: async (req, res, next) => {
    if(req.user){
      const nickname = req.user.nickname;
      try{
        const result = await select_auth(nickname);
        if(result.length > 0){
          req.user.auth = result[0].authority;
          next();
        }  
      }catch(err){
        console.error(err)
      }
    }else{
      next();
    }
  },
  mid_review_recent: async (req, res, next) => {
    try{
      const review = await review_recent();
      req.review_recent = review;
      next();  
    } catch(err){
      console.error(err)
    }
  },
  mid_search_result: async(req, res, next) => {
    const city = req.query.city;
    const score = req.query.score;
    const hashtag = req.query.hashtag;
    const corpname = req.query.corp_name;
    const order = req.query.order;
    const page = req.query.page;
    try{
      const data = await review_search_result(city, score, hashtag, corpname, order, page)
      let totalDataCnt
      if(page == undefined){
        totalDataCnt = await review_search_result_cnt(city, score, hashtag, corpname)
        if(totalDataCnt == undefined){totalDataCnt = [{cnt : 0}]}
      }
      req.corp_data = data;
      req.totalDataCnt = totalDataCnt
      next()  
    } catch(err){
      console.error(err)
    }
  },
  mid_review_edit: async (req, res, next)=>{
    const review_no = req.query.no;
    const user = req.user;
    try{
      const data = await mypage_review_edit(review_no);
      req.review = data;
      req.params.name = data.Corp_name;
      next()
    } catch(err){
      console.error(err)
    }
  },
}