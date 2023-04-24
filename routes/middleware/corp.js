const mysql = require("mysql");
const dbconfig = require("../../config/dbconfig.json");

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
  write: (req, res, next) => {
    const Corp_name = req.params.Corp_name;
    if (Corp_name){
      pool.query('SELECT ')

    }
    
    pool.query('INSERT into Review_Posts (Corp_name, Corp_location, User_id, first_date, last_date, type, career_score, worklife_score, welfare_score, culture_score, leadership_score, highlight, pros, cons, hashtag) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [contents.Corp_name, contents.Corp_location, contents.User_id, contents.first_date, contents.last_date, contents.type,
       contents.career_score, contents.worklife_score, contents.welfare_score, contents.culture_score, contents.leadership_score,
       contents.highlight, contents.pros, contents.cons, contents.hashtag], (err, rows, fields)=>{
      if(err) return res.json({ success: false, err})
      return res.status(200).send("<script>alert('소중한 후기 감사합니다.');location.href = '/';</script>");
       })
  }}