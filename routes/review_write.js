const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_info, Hash_info} = require("./middleware/corp");
const { write, write_auth } = require("./controllers/review");


router.get('/:name', auth, Corp_info, Hash_info, write_auth)

router.post('/:name', auth, write)

module.exports = router;