const mysql = require("mysql");
const dbconfig = require("../../config/dbconfig.json");
const { review_content } = require('../../modules/sql');
const rootdir = require("../../modules/path");


module.exports = {
  review_content: async (req, res, next) => {
    const Corp_name = req.params.name;
    const content = await review_content(Corp_name);
    if (content !== null){
      req.content = content;
      console.log('good')
      next();
    } else {
      console.log('리뷰 없음')
      next();
    }
  },
}