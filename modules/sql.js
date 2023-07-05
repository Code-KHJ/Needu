const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.json");
const { json } = require("body-parser");
const { hash } = require("bcrypt");

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
          FORMAT(round(avg(RP.total_score),1),1) as avg_total, 
          FORMAT(round(avg(RP.career_score),1),1) as avg_career, 
          FORMAT(round(avg(RP.worklife_score),1),1) as avg_worklife, 
          FORMAT(round(avg(RP.welfare_score),1),1) as avg_welfare, 
          FORMAT(round(avg(RP.culture_score),1),1) as avg_culture, 
          FORMAT(round(avg(RP.leadership_score),1),1) as avg_leadership
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
  HashTop_update: (Corp_name, hashTopList) => {
    return new Promise(async(resolve, reject)=>{
      const hashArray = hashTopList.map((row)=>row.hash).filter((value) => value !== null);
      let hash_query = hashArray.map((h,i)=> `hashtag_top${i+1} = '${h}'`).join(', ');
      let sql = `
        UPDATE Corp SET ${hash_query} WHERE Corp_name = '${Corp_name}';
      `
      try{
        pool.query(sql, (err, row)=>{
          if(err) return reject(err)
          else{
            return resolve(row)
          }
        })
      }catch (err){
        console.log(err);
        return reject(err);
      }
    })
  },
  review_content: (Corp_name) => {
    return new Promise((resolve, reject)=>{
      const sql = `
        SELECT 
          RP.*,
          FORMAT(RP.total_score,1) as total_score,
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
          FORMAT(round(avg(RP.total_score),1),1) as avg_total, 
          FORMAT(round(avg(RP.career_score),1),1) as avg_career, 
          FORMAT(round(avg(RP.worklife_score),1),1) as avg_worklife, 
          FORMAT(round(avg(RP.welfare_score),1),1) as avg_welfare, 
          FORMAT(round(avg(RP.culture_score),1),1) as avg_culture, 
          FORMAT(round(avg(RP.leadership_score),1),1) as avg_leadership,
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
  review_recent: () => {
    return new Promise((resolve, reject)=>{
      const sql = `
        SELECT *, 
        DATE_FORMAT(created_date, '%Y.%m') as date
        FROM Review_Posts
        ORDER BY No DESC
        LIMIT 10;`;
      try {
        pool.query(sql, (err, rows)=>{
        return resolve(rows)
        });
      } catch (err) {
        console.log(err);
        return reject(err);
      };
  })},
  review_search_result: (city,score,hashtag,corpname,order,page) => {
    return new Promise((resolve, reject) =>{
      if(corpname == undefined){corpname = ''};
      let sql = `
        SELECT
          C.Corp_name as Corp_name,
          C.sido as sido,
          C.gugun as gugun,
          C.hashtag_top1 as hashTop1,
          C.hashtag_top2 as hashTop2,
          C.hashtag_top3 as hashTop3,
          C.hashtag_top4 as hashTop4,
          count(RP.total_score) as cnt,
          FORMAT(round(avg(RP.total_score),1),1) as avg_total
        FROM Corp as C
          LEFT JOIN Review_Posts as RP
            ON C.Corp_name = RP.Corp_name
        WHERE C.Corp_name LIKE '%${corpname}%'
        GROUP BY C.Corp_name
        `;
      if(city || score || hashtag || corpname){
        if(city !== undefined && city !== null && city !== ''){
          const cityArray = city.split(',');
          let city_query = cityArray.map((c)=> `(sido = '${c}')`).join(' OR ');
          sql += `HAVING (${city_query})`;
        };
        if(score !== undefined && score !== null && score !== ''){
          const scoreArray = score.split(',');
          let score_query = scoreArray.map((s)=> `(avg_total >= ${s} AND avg_total < ${parseInt(s) + 1})`).join(' OR ');
          if(city){sql += (`AND (${score_query})`)}
          else{sql += (`HAVING (${score_query})`)};
        };
        if(hashtag !== undefined && hashtag !== null && hashtag !== ''){
          const hashtagArray = hashtag.split(',');
          let hash_query = hashtagArray.map((h)=> `((hashTop1 = '${h}') OR (hashTop2 = '${h}') OR (hashTop3 = '${h}') OR (hashTop4 = '${h}'))`).join(' OR ');
          if(city || score){sql += (`AND (${hash_query})`)}
          else{sql += (`HAVING (${hash_query})`)};
        };
      };

      //order 정렬
      if(order == 'count'){sql += `ORDER BY cnt DESC\n`}
      else{sql += `ORDER BY avg_total DESC\n`};

      //페이지네이션
      if(page !== undefined && page !== null && page !== ''){
        sql += `LIMIT ${(page - 1)*10}, 10`;
      }else{sql += `LIMIT 10`;}
      console.log(sql)
      try{
        pool.query(sql, (err, rows)=>{
          return resolve(rows)
        });
      } catch (err){
        console.log(err);
        return reject(err);
      }
    })
  },
  review_search_result_cnt: (city,score,hashtag,corpname) => {
    return new Promise((resolve, reject) =>{
      if(corpname == undefined){corpname = ''};
      let sql = `
        SELECT
          C.Corp_name
        FROM Corp as C
          LEFT JOIN Review_Posts as RP
            ON C.Corp_name = RP.Corp_name
        WHERE C.Corp_name LIKE '%${corpname}%'
        GROUP BY C.Corp_name
        `;
      if(city || score || hashtag || corpname){
        if(city !== undefined && city !== null && city !== ''){
          const cityArray = city.split(',');
          let city_query = cityArray.map((c)=> `(C.sido = '${c}')`).join(' OR ');
          sql += `HAVING (${city_query})`;
        };
        if(score !== undefined && score !== null && score !== ''){
          const scoreArray = score.split(',');
          let score_query = scoreArray.map((s)=> `(FORMAT(round(avg(RP.total_score),1),1) >= ${s} AND FORMAT(round(avg(RP.total_score),1),1) < ${parseInt(s) + 1})`).join(' OR ');
          if(city){sql += (`AND (${score_query})`)}
          else{sql += (`HAVING (${score_query})`)};
        };
        if(hashtag !== undefined && hashtag !== null && hashtag !== ''){
          const hashtagArray = hashtag.split(',');
          let hash_query = hashtagArray.map((h)=> `((C.hashTop1 = '${h}') OR (C.hashTop2 = '${h}') OR (C.hashTop3 = '${h}') OR (C.hashTop4 = '${h}'))`).join(' OR ');
          if(city || score){sql += (`AND (${hash_query})`)}
          else{sql += (`HAVING (${hash_query})`)};
        };
      };
      const sqlQuery = `
        SELECT count(*) AS cnt
        FROM (${sql}) AS T
      `
      try{
        pool.query(sqlQuery, (err, rows)=>{
          return resolve(rows)
        });
      } catch (err){
        console.log(err);
        return reject(err);
      }
    })
  },
}