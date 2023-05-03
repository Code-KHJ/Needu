const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_info, Hash_info} = require("./middleware/corp");
const {review_content} = require("./middleware/review");
const { review_auth, review_more } = require("./controllers/review");

router.get('/:name', auth, Corp_info, Hash_info, review_content, review_auth)

router.get('/:name/more',review_content, review_more)


router.post('/', )

module.exports = router;