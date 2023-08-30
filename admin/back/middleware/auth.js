const { select_auth } = require('../../../modules/sql');
const {sign, verify, refreshVerify} = require('../../../modules/jwt');
const jwt = require('jsonwebtoken');
const rootdir = require("../../../modules/path");


module.exports = {
  auth: async (req, res, next) => {
    const accessToken = req.cookies.AccessToken;
    if(accessToken == undefined){
      return res.status(404).render(rootdir+'/public/404.html');
    };
    const accessResult = verify(accessToken);
    if(accessResult.type){
      req.user = accessResult
      const authority = await select_auth(accessResult.nickname);
      if(authority[0].authority !== 100){
        return res.status(404).render(rootdir+'/public/404.html');
      }
      return next();
    }
    const refreshToken = req.cookies.RefreshToken;
    if(refreshToken == undefined){
      return res.status(404).render(rootdir+'/public/404.html');
    }
    const refreshResult = refreshVerify(refreshToken, accessResult.id);
    if(!refreshResult){
      return res.status(404).render(rootdir+'/public/404.html');
    }
    const newAccessToken = sign(accessResult.id, accessResult.nickname);
    res.cookie('AccessToken', newAccessToken, {
      secure: false,
      httpOnly: true
    });
    const newAccessResult = verify(newAccessToken);
    req.user = newAccessResult;
    const authority = await select_auth(newAccessResult.nickname);
    if(authority[0].authority !== 100){
      return res.status(404).render(rootdir+'/public/404.html');
    }
    next();
  },
}