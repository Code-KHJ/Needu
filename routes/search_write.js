const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_all, Hash_info} = require("./middleware/corp");
const {corp, Add_Corp} = require("./controllers/corp");

router.get('/', auth, (req, res)=>{
  res.render('search_write.html', {User: req.user})
})

router.get('/all', Corp_all, corp)

router.post('/add', Add_Corp)

module.exports = router;