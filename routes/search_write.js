const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_info, Hash_info} = require("./middleware/corp");
const { review_content, review_auth } = require("./middleware/review");


router.get('/', (req, res)=>{
  res.render('search_write.html')
})

module.exports = router;