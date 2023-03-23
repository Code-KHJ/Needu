const express = require("express");
const router = express.Router();
const auth =require("./middleware/auth");

// router.get('/', auth.verifyToken)


module.exports = router;