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
          C.sido as sido,
          C.gugun as gugun,
          count(RP.total_score) as cnt, 
          round(avg(RP.total_score),1) as avg_total, 
          round(avg(RP.career_score),1) as avg_career, 
          round(avg(RP.worklife_score),1) as avg_worklife, 
          round(avg(RP.welfare_score),1) as avg_welfare, 
          round(avg(RP.culture_score),1) as avg_culture, 
          round(avg(RP.leadership_score),1) as avg_leadership
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
        SELECT hash FROM(
          SELECT hashtag_1 as hash FROM Hashtag_Posts as HP
            LEFT JOIN Review_Posts as RP
            on HP.review_no = RP.No
          WHERE RP.Corp_name = "${Corp_name}"
            UNION ALL
          SELECT hashtag_2 as hash FROM Hashtag_Posts as HP
            LEFT JOIN Review_Posts as RP
            on HP.review_no = RP.No
          WHERE RP.Corp_name = "${Corp_name}"
          UNION ALL
          SELECT hashtag_3 as hash FROM Hashtag_Posts as HP
            LEFT JOIN Review_Posts as RP
            on HP.review_no = RP.No
          WHERE RP.Corp_name = "${Corp_name}"
          UNION ALL
          SELECT hashtag_4 as hash FROM Hashtag_Posts as HP
            LEFT JOIN Review_Posts as RP
            on HP.review_no = RP.No
          WHERE RP.Corp_name = "${Corp_name}"
            UNION ALL
          SELECT hashtag_5 as hash FROM Hashtag_Posts as HP
            LEFT JOIN Review_Posts as RP
            on HP.review_no = RP.No
          WHERE RP.Corp_name = "${Corp_name}"
        ) AS hashtag
        Group by hash
        ORDER by count(hash) DESC
        LIMIT 4;
        `
      try {
        pool.query(sql, (err, rows)=>{
        return resolve(rows)
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
          LEFT JOIN Hashtag_Posts as HP
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
  Add_corp: (Corp_name, sido, gugun) => {
    return new Promise((resolve, reject)=>{
      const sql = 'insert into Corp (Corp_name, sido, gugun) values (?, ?, ?)';
      try {
        pool.query(sql, [Corp_name, sido, gugun], (err, result)=>{
          if(err) return err;
          return resolve(result.protocol41)
        })
      } catch (err){
          console.log(err);
          return reject(err);
      }
    })},
  top10_corp: (item) => {
    return new Promise((resolve, reject)=>{
      const sql = `
        SELECT 
          C.Corp_name as name,
          C.sido as sido,
          C.gugun as gugun,
          count(RP.total_score) as cnt, 
          round(avg(RP.total_score),1) as avg_total, 
          round(avg(RP.career_score),1) as avg_career, 
          round(avg(RP.worklife_score),1) as avg_worklife, 
          round(avg(RP.welfare_score),1) as avg_welfare, 
          round(avg(RP.culture_score),1) as avg_culture, 
          round(avg(RP.leadership_score),1) as avg_leadership,
          RP.nickname as nickname,
          RP.last_date as last_date,
          RP.type as type,
          DATE_FORMAT(RP.created_date, '%Y.%m') as date,
          RP.highlight as highlight,
          RP.pros as pros,
          RP.cons as cons
        FROM Corp as C 
          LEFT JOIN Review_Posts as RP on C.Corp_name = RP.Corp_name
        GROUP BY C.Corp_name
        ORDER BY ${item} DESC
        LIMIT 10;`;
      try {
        pool.query(sql, (err, rows)=>{
          return resolve(rows)
        });
      } catch (err){
        console.log(err);
        return reject(err);
      }
    })
  },
}