const mysql = require("mysql");
const dbconfig = require("../../config/dbconfig.json");
const rootdir = require("../../modules/path");
const { body, validationResult } = require("express-validator");
const { use } = require('..');
const { NodeResolveLoader } = require("nunjucks");
const { hash } = require("bcrypt");
const { Hash_info, HashTop_update } = require("../../modules/sql");

// Database connection pool
const pool = mysql.createPool({
  host    : dbconfig.host,
  user    : dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
  connectionLimit: 100,
  debug   :false
})

module.exports = {
  write: (req, res) => {
    const contents = {
      Corp_name : req.params.name,
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
    const hashtag = {};
    for (let i = 1; i<=16; i++){
      const key = `hashtag_${i}`;
      const value = req.body[`hash_${i}`];
      hashtag[key] = value;
    }
    try{
      //기관리뷰 create
      pool.query('INSERT into Review_Posts (Corp_name, nickname, first_date, last_date, type, growth_score, leadership_score, reward_score, worth_score, culture_score, worklife_score, highlight, pros, cons) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [contents.Corp_name, contents.nickname, contents.first_date, contents.last_date, contents.type,
       contents.growth_score, contents.leadership_score, contents.reward_score, contents.worth_score, contents.culture_score, contents.worklife_score,
       contents.highlight, contents.pros, contents.cons], (err, result)=>{
      if(err) return res.json({ success: false, err})
      else {
        const review_no = result.insertId
        try{
          //해시태그 create
          pool.query('INSERT into Hashtag_Posts (Corp_name, review_no, hashtag_1, hashtag_2, hashtag_3, hashtag_4, hashtag_5, hashtag_6, hashtag_7, hashtag_8, hashtag_9, hashtag_10, hashtag_11, hashtag_12, hashtag_13, hashtag_14, hashtag_15, hashtag_16) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [contents.Corp_name, review_no, hashtag.hashtag_1, hashtag.hashtag_2, hashtag.hashtag_3, hashtag.hashtag_4, hashtag.hashtag_5, hashtag.hashtag_6, hashtag.hashtag_7, hashtag.hashtag_8, hashtag.hashtag_9, hashtag.hashtag_10, hashtag.hashtag_11, hashtag.hashtag_12, hashtag.hashtag_13, hashtag.hashtag_14, hashtag.hashtag_15, hashtag.hashtag_16
          ], async (err, rows, fields)=>{
          if(err) return res.json({ success: false, err})
          else{
            const hashTopList = await Hash_info(contents.Corp_name);
            const hashUpdate_result = await HashTop_update(contents.Corp_name, hashTopList);
            pool.query('UPDATE user SET authority = 1 WHERE nickname = "' + contents.nickname + '"', (err, row)=>{
              if(err) return res.json({ success: false, err})
              else{
                return res.status(200).send("<script>alert('소중한 후기 감사합니다.');location.href = '/review/corp/"+contents.Corp_name+"';</script>");
              }
            })
          }})}
        catch(err){
          console.log(err);
          return err
        }
       }})
    } catch(err){
      console.log(err);
      return err
    }
  },
  write_auth: (req, res) => {
    const middle_info = {
      User: req.user,
      Corp: req.corp,
      hash: req.hash
    }
    if (middle_info.User) {
      if (middle_info.Corp){
        res.render(rootdir+'/public/write_detail.html', middle_info)
      }else{
        return res.status(200).send("<script>alert('아직 등록되지 않은 기관이므로, 기관정보를 먼저 알려주세요.');history.go(-1);</script>");
      }
    }
    else {
      return res.status(200).send("<script>alert('로그인 하신 후 이용할 수 있는 서비스입니다.');location.href = '/login';</script>");
    }
  },
  review_detail: (req, res) => {
    let cnt = true
    if(req.corp.cnt == 0){
      cnt = false
    }
    const middle_info = {
      User: req.user,
      Corp: req.corp,
      hash: req.hash,
      content: req.content[0],
      cnt : cnt,
      top10 : req.top10
    }
    res.render(rootdir+'/public/review_detail.html', middle_info)
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
        res.json({auth: User.auth, content: newContents})
      }
      else{
        res.json({auth: User.auth})
      }
    }
    else {
      res.json({auth: 'none'})
    }
  },
  review_likes: (req, res) => {
    const User = req.user
    if (User) {
      const corp_name = req.body.name
      const review_num = req.body.num
      const review_like = req.body.likes
      const update_sql = `
        UPDATE Review_Posts 
        SET likes = likes + ${review_like}
        WHERE No = (
          SELECT No FROM (
            SELECT No
            FROM Review_Posts
            WHERE Corp_name = "${corp_name}"
            ORDER BY No DESC
            LIMIT 1 OFFSET ${review_num}
          ) AS subquery
        );
        `
      try {
        pool.query(update_sql, (err, rows)=>{
          if(err) throw err;
          return res.send(JSON.stringify(req.user))
        })
      } catch(err){
        console.log(err);
      }
    } else {
      return res.send(JSON.stringify("권한없음"));
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
    const data = {
      User: req.user,
      Corp_data: req.corp_data,
      Order: req.query.order,
      Page: req.query.page,
      Count: req.totalDataCnt
    }
    if(data.Count !== undefined){res.cookie('totalCount', data.Count)};
    res.render(rootdir+'/public/review_search.html', data);
  },
}


      
