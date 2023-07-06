const mysql = require("mysql");
const dbconfig = require("../../config/dbconfig.json");
const { Corp_info, Corp_all, Hash_info, top10_corp } = require('../../modules/sql');
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
      req.corp = info;
      next();
    } else {
      next();
    }
  },
  Corp_all: async(req, res, next) => {
    const corp = await Corp_all()
    req.corp = corp
    next()
  },
  Hash_info: async (req, res, next) => {
    const Corp_name = req.params.name;
    const Hash = await Hash_info(Corp_name);
    if (Hash[0] !== null){
      req.hash = Hash;
      next();  
    } else {
      next();
    }
  },
  mid_top10_corp: async(req, res, next) => {
    const avg_total = "avg_total";
    const top10 = await top10_corp(avg_total);
    req.top10 = top10
    next()
  },
  mid_top10_detail: async(req, res, next) => {
    if(req.query.data){
      const detail_item = req.query.data;
      const detail10 = await top10_corp(detail_item);
      req.detail10 = detail10;
      req.tf = true;
      next();
    } else{
    const default_item = "avg_growth";
    const detail10 = await top10_corp(default_item);
    req.detail10 = detail10;
    req.tf = false;
    next();
    }
  }
}
