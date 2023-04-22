const mysql = require("mysql");
const dbconfig = require("../../config/dbconfig.json");
const { body, validationResult } = require("express-validator");
const { use } = require('..');

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
  write: async (req, res) => {
  const contents = {
    Corp_name : 'test',
    Corp_location : ,
    User_id : ,
    first







  }


  }
}
