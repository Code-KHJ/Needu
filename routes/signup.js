const express = require("express");
const router = express.Router();
const {signup, checkId} = require("./controllers/user");
const rootdir = require("../modules/path");


router.get('/', (req,res)=>{
    res.sendFile(rootdir+'/public/signup.html')})
router.post('/', signup)
router.post('/checkId', checkId)

module.exports = router;