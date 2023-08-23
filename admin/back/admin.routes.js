const express = require("express");
const router = express.Router();



router.get('/', (req, res)=>{
  console.log('admin 페이지입니다.')
})


module.exports = router;
