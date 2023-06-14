const {sign, verify, refreshVerify} = require('../../modules/jwt');
const jwt = require('jsonwebtoken');
const secret = require('../../config/jwtsecret').JWT_KEY;

module.exports = {
    auth: (req, res, next) => {
    const AccessToken = req.cookies.AccessToken
    if (AccessToken){
        const AccessResult = verify(AccessToken);
        const decoded = jwt.decode(AccessToken);
        if (AccessResult.type){ //엑세스 토큰 인증 완료
            req.user = AccessResult
            next();
        } else{ //엑세스 토큰 만료 리프레시토큰 검증 후 재발급
            const refreshToken = req.cookies.RefreshToken
            if(refreshToken){
                const refreshresult = refreshVerify(refreshToken, decoded.id)
                if(refreshresult){//엑세스토큰 만료, 리프레시토큰 정상
                    const newAccessToken = sign(decoded.id, decoded.nickname)
                    res.cookie('AccessToken', newAccessToken, {
                        secure: false,
                        httpOnly: true,
                    })
                    const NewAccessResult = verify(newAccessToken);
                    req.user = NewAccessResult
                    next();}
                else{//엑세스토큰 만료, 리프레시토큰 비정상
                next();
            }
            }else{next()}
        }
    } else {
        next();
    }},
}
