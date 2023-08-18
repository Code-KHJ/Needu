const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {mid_top10_corp, mid_top10_detail} = require("./middleware/corp");
const { mid_review_recent } = require("./middleware/review");
const { review_detail, review_more, review_likes, con_top10_detail, con_search_result } = require("./controllers/review");



router.get('/', auth, mid_review_recent, mid_top10_corp, mid_top10_detail, (req, res)=>{
  const middle_info = {
    User: req.user,
    review: req.review_recent,
    top10 : req.top10,
    detail10 : req.detail10,
  }
  res.render(rootdir+'/public/main.html', middle_info)
})

//메인페이지 보류
router.get('/sub', auth, mid_review_recent, (req, res)=>{
  const middle_info = {
    User: req.user,
    review: req.review_recent,
  }
  res.render(rootdir+'/public/sub_main.html', middle_info)
})

module.exports = router;