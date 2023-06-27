const express = require("express");
const router = express.Router();
const {login} = require("./controllers/user");
const {auth} = require("./middleware/auth");
const rootdir = require("../modules/path");

router.get('/', auth, (req,res)=>{
  if(req.user){
    res.redirect("/")
  }else{
    res.cookie('returnPage', req.header("referer"))
    res.sendFile(rootdir+'/public/login.html')
  }})
router.post('/', login)

module.exports = router;