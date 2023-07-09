const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_all, Corp_info, Hash_info} = require("./middleware/corp");
const {corp, Add_Corp} = require("./controllers/corp");
const { write, write_auth } = require("./controllers/review");


router.get('/', auth, (req, res)=>{
  res.render(rootdir+'/public/write_search.html', {User: req.user})
})

router.get('/all', Corp_all, corp)

router.post('/add', Add_Corp)


router.get('/corp/:name', auth, Corp_info, Hash_info, write_auth)

router.post('/corp/:name', auth, write)

module.exports = router;