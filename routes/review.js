const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_info, Hash_info} = require("./middleware/corp");
const { review_content, review_auth } = require("./middleware/review");
const { review, review_more, review_likes } = require("./controllers/review");

router.get('/:name', auth, Corp_info, Hash_info, review_content, review)

router.get('/:name/more',auth, review_content, review_auth, review_more)

router.post('/', )

router.post('/:name/likes', auth, review_auth, review_likes)

module.exports = router;