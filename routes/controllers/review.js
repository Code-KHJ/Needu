const mysql = require("mysql");
const dbconfig = require("../../config/dbconfig.json");
const rootdir = require("../../modules/path");
const { body, validationResult } = require("express-validator");
const { use } = require('..');
const { NodeResolveLoader } = require("nunjucks");
const { hash } = require("bcrypt");
const sql = require("../../modules/sql");

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
      career_score : parseInt(req.body.career)/2,
      worklife_score : parseInt(req.body.worklife)/2,
      welfare_score : parseInt(req.body.welfare)/2,
      culture_score : parseInt(req.body.culture)/2,
      leadership_score : parseInt(req.body.leadership)/2,
      highlight : req.body.highlight,
      pros : req.body.pros,
      cons : req.body.cons,
    }
    const hashtag = {
      hashtag_1 : req.body.hash_1,
      hashtag_2 : req.body.hash_2,
      hashtag_3 : req.body.hash_3,
      hashtag_4 : req.body.hash_4,
      hashtag_5 : req.body.hash_5
    }
    try{
      //기관리뷰 create
      pool.query('INSERT into Review_Posts (Corp_name, nickname, first_date, last_date, type, career_score, worklife_score, welfare_score, culture_score, leadership_score, highlight, pros, cons) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [contents.Corp_name, contents.nickname, contents.first_date, contents.last_date, contents.type,
       contents.career_score, contents.worklife_score, contents.welfare_score, contents.culture_score, contents.leadership_score,
       contents.highlight, contents.pros, contents.cons], (err, result)=>{
      if(err) return res.json({ success: false, err})
      else {
        const review_no = result.insertId
        try{
          //해시태그 create
          pool.query('INSERT into Hashtag_Posts (review_no, hashtag_1, hashtag_2, hashtag_3, hashtag_4, hashtag_5) values (?,?,?,?,?,?)',
          [review_no, hashtag.hashtag_1, hashtag.hashtag_2, hashtag.hashtag_3, hashtag.hashtag_4, hashtag.hashtag_5
          ], (err, rows, fields)=>{
          if(err) return res.json({ success: false, err})
          else{
            pool.query('UPDATE user SET authority = 1 WHERE nickname = "' + contents.nickname + '"', (err, row)=>{
              if(err) return res.json({ success: false, err})
              else{
                return res.status(200).send("<script>alert('소중한 후기 감사합니다.');location.href = '/review/"+contents.Corp_name+"';</script>");
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
        res.render(rootdir+'/public/review_write.html', middle_info)
      }else{
        return res.status(200).send("<script>alert('아직 등록되지 않은 기관이므로, 기관정보를 먼저 알려주세요.');location.href = '/';</script>");
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
  search_review: (req, res) => {
    const middle_info = {
      User: req.user,
      review: req.review_recent,
      top10 : req.top10
    }
    res.render(rootdir+'/public/search_review.html', middle_info)
  },
}


      
