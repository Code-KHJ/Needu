const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_all, Hash_info} = require("./middleware/corp");
const {corp} = require("./controllers/corp");


router.get('/', (req, res)=>{
  res.render('search_write.html')
})
router.get('/all', Corp_all, corp)
module.exports = router;