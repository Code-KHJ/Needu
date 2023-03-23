const express = require("express");
const router = express.Router();
const {login} = require("./controllers/user");
const rootdir = require("../modules/path");


router.get('/', (req,res)=>{
    res.sendFile(rootdir+'/public/login.html')})
router.post('/', login)

module.exports = router;