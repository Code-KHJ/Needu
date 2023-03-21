const jwt = require('../modules/jwt');
const redisClient = require("../modules/redis");
const secret = process.env.JWT_KEY;
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const dbconfig = require("../config/dbconfig.json");

// Database connection pool
const pool = mysql.createPool({
    host    : dbconfig.host,
    user    : dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    connectionLimit: 100,
    debug   :false
})

module.exports = {
    login: async (req, res) => {
        const {id, password} = req.body;
        //로그인 유효성검사
        pool.query('SELECT password FROM user WHERE id = "' + id + '"', (err, row)=>{
            if(err) return console.log(err)
            else if(row[0] !== undefined){
                const match = bcrypt.compareSync(password, row[0].password)
                if(match){
                    try {
                        //access Token 발급
                        const accessToken = jwt.sign(id);
                        // //refresh Token 발급
                        const refreshToken = jwt.refresh();
                        // //redis에 refreshToken 저장
                        redisClient.set(id, refreshToken);
                        //Token 전송
                        res.cookie('AccessToken', accessToken, {
                            secure: false,
                            httpOnly: true,
                        })
                        res.cookie('RefreshToken', refreshToken, {
                            secure: false,
                            httpOnly: true,
                        })
                        return res.status(200).redirect('/')
                    } catch (err) {
                        res.status(500).json({err});
                    }
                } else{
                //비밀번호 불일치
                res.send("<script>alert('아이디 혹은 비밀번호가 일치하지 않습니다.');location.href = document.referrer;</script>");
            }
            } else{
            //존재하지 않는 계정
            res.send("<script>alert('아이디가 존재하지 않습니다.');location.href = document.referrer;</script>");
            }
        })},
    logout: (req,res) => {
        const id = jwt.verify(req.cookies.AccessToken).id
        redisClient.del(id)
        res.clearCookie('AccessToken')
        res.clearCookie('RefreshToken')
        res.redirect("/")
    }
}