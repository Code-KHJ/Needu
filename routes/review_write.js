const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");


router.get('/', (req,res)=>{
  res.sendFile(rootdir+'/public/review_write.html')})
router.post('/', (req, res)=>{console.log(req.body)})

module.exports = router;