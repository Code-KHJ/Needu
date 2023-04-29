const mysql = require("mysql");
const dbconfig = require("../../config/dbconfig.json");
const rootdir = require("../../modules/path");
const { body, validationResult } = require("express-validator");
const { use } = require('..');

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
      hashtag_1 : Boolean(req.body.hash_1),
      hashtag_2 : Boolean(req.body.hash_2),
      hashtag_3 : Boolean(req.body.hash_3),
      hashtag_4 : Boolean(req.body.hash_4),
      hashtag_5 : Boolean(req.body.hash_5)
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
                return res.status(200).send("<script>alert('소중한 후기 감사합니다.');location.href = '/';</script>");
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
      res.render(rootdir+'/public/review_write.html', middle_info)
    }
    else {
      return res.status(200).send("<script>alert('로그인 하신 후 이용할 수 있는 서비스입니다.');location.href = '/login';</script>");
    }
  },
  review_auth: (req, res) => {
    const middle_info = {
      User: req.user,
      Corp: req.corp,
      hash: req.hash,
      content: req.content
    }
    //여기서부터ㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓ
    res.render(rootdir+'/public/review.html', middle_info)}

}

