const mysql = require("mysql");
const dbconfig = require("../../config/dbconfig.json");
const { Corp_info } = require('../../modules/sql')


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
    if (info.name !== undefined){
      console.log('success');
      req.info = info;
      next();
    } else {
      console.log('기관등록 필요')
    }
      }
    };