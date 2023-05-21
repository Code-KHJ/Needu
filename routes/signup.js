const express = require("express");
const router = express.Router();
const {signup, duplic} = require("./controllers/user");
const {auth} = require("./middleware/auth");
const rootdir = require("../modules/path");


router.get('/', auth, (req,res)=>{
  if(req.user){
    res.redirect("/")    
  }else{
    res.sendFile(rootdir+'/public/signup.html')
  }})
router.post('/', signup)
router.post('/duplic', duplic)

module.exports = router;