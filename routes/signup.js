const express = require("express");
const router = express.Router();
const {signup, duplic} = require("./controllers/user");
const rootdir = require("../modules/path");


router.get('/', (req,res)=>{
    res.sendFile(rootdir+'/public/signup.html')})
router.post('/', signup)
router.post('/duplic', duplic)

module.exports = router;