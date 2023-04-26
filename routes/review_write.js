const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_info} = require("./middleware/corp");
const { write } = require("./controllers/review");


router.get('/:name', auth, Corp_info, (req,res)=>{
  res.render(rootdir+'/public/review_write.html', req.info)})


router.post('/:name', auth, write)

module.exports = router;