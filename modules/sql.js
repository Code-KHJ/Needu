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
          LEFT JOIN Review_Posts as RP 
          on C.Corp_name = RP.Corp_name
        WHERE C.Corp_name = "${Corp_name}";`;
      try {
        pool.query(sql, (err, row, fields)=>{
        return resolve(row[0])
        });
        
      } catch (err) {
        console.log(err);
        return reject(err);
      };
    })
  },
  Corp_all: () => {
    return new Promise((resolve, reject)=>{
      const sql = `
        SELECT *
        FROM Corp`;
      try {
        pool.query(sql, (err, rows)=>{
        return resolve(rows)
        });
      } catch (err) {
        console.log(err);
        return reject(err);
      };
    })
  },
  Hash_info: (Corp_name) => {
    return new Promise((resolve, reject)=>{
      const sql = `
        SELECT *
        FROM
          (SELECT 
            sum(HP.hashtag_1) as hash_1,
            sum(HP.hashtag_2) as hash_2,
            sum(HP.hashtag_3) as hash_3,
            sum(HP.hashtag_4) as hash_4,
            sum(HP.hashtag_5) as hash_5
          FROM Review_Posts as RP
            LEFT JOIN Hashtag_Posts as HP
            on RP.No = HP.review_no
          WHERE RP.Corp_name = "${Corp_name}") as hashtag
          ;
        `
      try {
        pool.query(sql, (err, row, fields)=>{
        return resolve(row[0])
        });
      } catch (err) {
        console.log(err);
        return reject(err);
      };
  })},
  review_content: (Corp_name) => {
    return new Promise((resolve, reject)=>{
      const sql = `
        SELECT 
          RP.*,
          DATE_FORMAT(RP.created_date, '%Y.%m') as date,
          HP.hashtag_1, HP.hashtag_2, HP.hashtag_3, HP.hashtag_4, HP.hashtag_5
        FROM Review_Posts as RP
          LEFT JOIN Hashtag_posts as HP
          on RP.No = HP.review_no
        WHERE RP.Corp_name = "${Corp_name}"
        ORDER BY no DESC;`
      try {
        pool.query(sql, (err, rows)=>{
        return resolve(rows)
        });
      } catch (err) {
        console.log(err);
        return reject(err);
      };
    })},
  }