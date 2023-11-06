const express = require('express');
const router = express.Router();
const rootdir = require('../modules/path');

const { auth } = require('./middleware/auth');

router.get('/', auth, (req, res) => {
  const middle_info = {
    User: req.user,
  };
  res.status(200).render(rootdir + '/public/chat_complete.html', middle_info);
});

module.exports = router;
