const mysql = require("mysql");
const dbconfig = require("../../config/dbconfig.json");
const { review_content } = require('../../modules/sql');
const rootdir = require("../../modules/path");

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
  review_content: async (req, res, next) => {
    const Corp_name = req.params.name;
    const content = await review_content(Corp_name);
    if (content !== null){
      req.content = content;
      next();
    } else {
      console.log('리뷰 없음')
      next();
    }
  },
  review_auth:(req, res, next) => {
    if(req.user){
      const nickname = req.user.nickname;
      pool.query('SELECT authority FROM user WHERE nickname = "'+ nickname + '"',(err,rows)=>{
        if(rows[0] !== null){
          req.user.auth = rows[0].authority;
          next();
        }
      })}
    else{
      next();
    }
  },
}