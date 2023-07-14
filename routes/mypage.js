const express = require("express");
const router = express.Router();
const {login} = require("./controllers/user");
const {auth} = require("./middleware/auth");
const rootdir = require("../modules/path");


router.get("/profile", auth, (req, res)=>{res.render('mypage_profile.html', {User: req.user})});



module.exports = router;