const request = require('request');
const rootdir = require("../../../modules/path");
const mysql = require("mysql");
const dbconfig = require("../../../config/dbconfig.json");

process.on('uncaughtException', (err)=>{
  console.error(err)
})

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
  userList: (req, res)=>{
    const sql = `
      SELECT 
        *, 
        DATE_FORMAT(created_date, '%Y.%m.%d') as cre_date, 
        DATE_FORMAT(modified_date, '%Y.%m.%d') as mod_date,
        DATE_FORMAT(login_date, '%Y.%m.%d') as login_date
      FROM user
    ;`
    try{
      pool.query(sql, (err, rows)=>{
        if(err){
          console.error(err);
          return res.status(500).json({err});
        }

        const data = {
          Admin: req.user,
          User: rows
        }
        return res.status(200).render(rootdir+'/admin/front/user.html', data);
      })
    } catch(err){
      console.error(err)
      res.status(500).json({err});
    }
  }
}