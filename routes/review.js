const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_info, Hash_info, mid_top10_corp, mid_top10_detail} = require("./middleware/corp");
const { review_content, review_auth, mid_review_recent, mid_search_result } = require("./middleware/review");
const { review_detail, review_more, review_likes, search_review, con_top10_detail, con_search_result } = require("./controllers/review");


router.get('/', auth, mid_review_recent, mid_top10_corp, mid_top10_detail, search_review)

router.get("/search", auth, mid_search_result, con_search_result)

router.get('/detail', auth, mid_top10_detail, con_top10_detail)

router.get('/corp/:name', auth, Corp_info, Hash_info, review_content, mid_top10_corp, review_detail)

router.get('/corp/:name/more',auth, review_content, review_auth, review_more)

router.post('/', )

router.post('/corp/:name/likes', auth, review_auth, review_likes)

module.exports = router;