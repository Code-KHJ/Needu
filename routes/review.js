const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const { write } = require("./controllers/review");


router.get('/:name', (req,res)=>{
  const Corp_name = req.params.name
  res.render(rootdir+'/public/review.html', {Corp_name: Corp_name})})


router.post('/', )

module.exports = router;