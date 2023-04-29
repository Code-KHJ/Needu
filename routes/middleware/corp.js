const mysql = require("mysql");
const dbconfig = require("../../config/dbconfig.json");
const { Corp_info, Hash_info } = require('../../modules/sql');
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
  Corp_info: async (req, res, next) => {
    const Corp_name = req.params.name;
    const info = await Corp_info(Corp_name);
    if (info.name !== null){
      req.info = info;
      next();
    } else {
      console.log('기관등록 필요')
      //기관 등록페이지로 보내기
      res.render(rootdir+'/public/main.html')
    }
  },
  Hash_info: async (req, res, next) => {
    const Corp_name = req.params.name;
    const Hash = await Hash_info(Corp_name);
    if (Hash.hash_1 !== null){
      req.hash = Hash;
      console.log(req.hash)
      next();  
    } else {
      console.log('기관123등록 필요')
      //기관 등록페이지로 보내기
      res.render(rootdir+'/public/main.html')
    }
    }}
