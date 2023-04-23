const mysql = require("mysql");
const dbconfig = require("../../config/dbconfig.json");
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
    const total_score = (req.body.career_score+req.body.worklife_score+req.body.welfare_score+req.body.culture_score+req.body.leadership_score)/5
    const contents = {
      Corp_name : '연습용기관',
      Corp_location : '서울시 양천구',
      User_id : 'testId',
      first_date : req.body.first_date,
      last_date : req.body.last_date,
      type : req.body.work_type,
      career_score : parseInt(req.body.career),
      worklife_score : parseInt(req.body.worklife),
      welfare_score : parseInt(req.body.welfare),
      culture_score : parseInt(req.body.culture),
      leadership_score : parseInt(req.body.leadership),
      highlight : req.body.highlight,
      pros : req.body.pros,
      cons : req.body.cons,
      hashtag : 'hash'
    }
    pool.query('INSERT into Review_Posts (Corp_name, Corp_location, User_id, first_date, last_date, type, career_score, worklife_score, welfare_score, culture_score, leadership_score, highlight, pros, cons, hashtag) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [contents.Corp_name, contents.Corp_location, contents.User_id, contents.first_date, contents.last_date, contents.type,
       contents.career_score, contents.worklife_score, contents.welfare_score, contents.culture_score, contents.leadership_score,
       contents.highlight, contents.pros, contents.cons, contents.hashtag], (err, rows, fields)=>{
      if(err) return res.json({ success: false, err})
      return res.status(200).send("<script>alert('소중한 후기 감사합니다.');location.href = '/';</script>");
       })
  }}

