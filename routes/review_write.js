const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const { write } = require("./controllers/review");


router.get('/:name', auth, (req,res)=>{
  const Corp_name = req.params.name
  res.render(rootdir+'/public/review_write.html', {Corp_name: Corp_name})})


router.post('/:name', auth, write)

module.exports = router;