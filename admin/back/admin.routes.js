const express = require("express");
const router = express.Router();
const { auth } = require("../back/middleware/auth");
const { reviewList } = require("../back/controllers/review");
const { userList } = require("../back/controllers/user");





router.get('/', auth, (req, res)=>{
  return res.status(200).redirect('/admin/review');
})
router.get('/review', auth, reviewList);
router.get('/user', auth, userList);



module.exports = router;
