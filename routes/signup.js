const express = require("express");
const router = express.Router();
const {signup, duplic ,mailAuth} = require("./controllers/user");
const {auth} = require("./middleware/auth");
const rootdir = require("../modules/path");
const path = require('path');


router.get('/', auth, (req,res)=>{
  if(req.user){
    res.redirect("/")    
  }else{
    res.sendFile(rootdir+'/public/signup.html')
  }})

router.post('/', signup)

router.post('/duplic', duplic)

router.post('/mail', mailAuth)

module.exports = router;