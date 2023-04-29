const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_info, Hash_info} = require("./middleware/corp");

router.get('/:name', auth, Corp_info, Hash_info, (req,res)=>{
  const templateData = {
    info: req.info,
    hash: req.hash
  }
  res.render(rootdir+'/public/review.html', templateData)})


router.post('/', )

module.exports = router;