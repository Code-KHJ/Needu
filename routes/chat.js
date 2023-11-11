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
    return res.status(404).send("<script>location.href = '/';</script>");
  }
  res.status(200).render(rootdir + '/public/chat_reserve.html', middle_info);
});

//https://http://localhost:3000//chat/complete?status=confirm&calendar_code=qDiuJoXq8p&calendar_name=1시간 미팅&event_start_at=2022-04-12T12:00:00+09:00&event_end_at=2022-04-12T13:00:00+09:00&invitee_email=rangken4@naver.com&invitee_name=테스트&invitee_phone=

router.get('/complete', auth, (req, res) => {
  const middle_info = {
    User: req.user,
    Query: req.query,
  };
  if (!middle_info.User) {
    return res
      .status(401)
      .send(
        "<script>alert('로그인 하신 후 이용할 수 있는 서비스입니다.');location.href = '/login';</script>"
      );
  }
  if (middle_info.Query.status !== 'confirm') {
    return res.status(401).send("<script>location.href = '/';</script>");
  }

  res.status(200).render(rootdir + '/public/chat_complete.html', middle_info);
});

module.exports = router;
