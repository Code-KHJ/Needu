const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_info} = require("./middleware/corp");

router.get('/:name', auth, Corp_info, (req,res)=>{
  res.render(rootdir+'/public/review.html', req.info)})


router.post('/', )

module.exports = router;