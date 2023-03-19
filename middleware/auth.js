const jwt = require('../modules/jwt');
const secret = require('../config/jwtsecret').JWT_KEY;

exports.auth = (req, res, next) => {
    const AccessToken = req.cookies.AccessToken
    if (AccessToken != null){
        try {
            const userId = jwt.verify(AccessToken).id
            req.user = userId;
            next();
        } catch{
            next();
        }
    } else {
        next()
    }
    // const headers = req.headers;
    // //토큰 없을 경우
    // if (!headers.hasOwnProperty('authorization')) {
    //     return res.status(200).json({
    //         status: 403,
    //         success: false,
    //         message: '로그인이 필요합니다.'
    //     });
    // }
    // const token = req.headers.authorization.split('Bearer ')[1] || req.headers['x-access-token']
    // if (!token || token === 'null') {
    //     return res.status(200).json({
    //         status: 403,
    //         success: false,
    //         message: '로그인이 필요합니다.'
    //     })
    // }
    // // 토큰이 유효한지 검증

    // let info = {
    //     type: false,
    //     message: ''
    // }

    // const p = new Promise((resolve, reject) => {
    //     jwt.verify(token, secret, (err, decoded) => {
    //         if (err) { // 토큰이 일치하지 않음.
    //             console.error(err)
    //             info.type = false;
    //             info.message = '토큰이 일치하지 않습니다.';
    //             return res.status(200).json({
    //                 status: 403,
    //                 success: false,
    //                 info: info,
    //             })
    //         }
    //         resolve(decoded);
    //     })
    // });

    // p.then((decoded) => {
    //     req.decoded = decoded;
    //     next();
    // })
}