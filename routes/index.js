const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_info, Hash_info, mid_top10_corp, mid_top10_detail} = require("./middleware/corp");
const { review_content, review_auth, mid_review_recent } = require("./middleware/review");

router.get('/', auth, mid_review_recent, (req, res)=>{
  const middle_info = {
    User: req.user,
    review: req.review_recent,
  }
  res.render(rootdir+'/public/main.html', middle_info)
})

module.exports = router;