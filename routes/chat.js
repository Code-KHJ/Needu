const express = require('express');
const router = express.Router();
const rootdir = require('../modules/path');

const { auth } = require('./middleware/auth');

router.get('/reserve', auth, (req, res) => {
  const middle_info = {
    User: req.user,
    Host: req.query.id,
  };
  if (!middle_info.User) {
    return res
      .status(401)
      .send(
        "<script>alert('로그인 하신 후 이용할 수 있는 서비스입니다.');location.href = '/login';</script>"
      );
  }
  if (!middle_info.Host) {
    return res
      .status(404)
      .send("<script>alert('에러');location.href = '/';</script>");
  }
  res.status(200).render(rootdir + '/public/chat_reserve.html', middle_info);
});

router.get('/complete', auth, (req, res) => {
  const middle_info = {
    User: req.user,
  };
  if (!middle_info.User) {
    return res
      .status(401)
      .send(
        "<script>alert('로그인 하신 후 이용할 수 있는 서비스입니다.');location.href = '/login';</script>"
      );
  }

  res.status(200).render(rootdir + '/public/chat_complete.html', middle_info);
});

module.exports = router;
