const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const { write } = require("./controllers/review");


router.get('/', (req,res)=>{
  
  res.sendFile(rootdir+'/public/review_write.html')})


router.post('/', write)

module.exports = router;