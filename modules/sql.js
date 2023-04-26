const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.json");
const { json } = require("body-parser");

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
  Corp_info: (Corp_name) => {
    return new Promise((resolve, reject)=>{
      const sql = `
        SELECT 
          C.Corp_name as name,
          C.Corp_location as location, 
          count(*) as cnt, 
          round(avg(total_score),1) as avg_total, 
          round(avg(career_score),1) as avg_career, 
          round(avg(worklife_score),1) as avg_worklife, 
          round(avg(welfare_score),1) as avg_welfare, 
          round(avg(culture_score),1) as avg_culture, 
          round(avg(leadership_score),1) as avg_leadership
        FROM Corp as C 
          LEFT JOIN Review_Posts as RP on C.Corp_name = RP.Corp_name 
        WHERE C.Corp_name = "${Corp_name}";`;
      try {
        pool.query(sql, (err, row, fields)=>{
        console.log(row[0])
        return resolve(row[0])
        });
      } catch (err) {
        console.log(err);
        return reject(err);
      };
    })
  }




};