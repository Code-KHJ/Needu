const mysql = require("mysql");
const dbconfig = require("./config/dbconfig.json");

// Database connection pool
const pool = mysql.createPool({
    host    : dbconfig.host,
    user    : dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    connectionLimit: 100,
    debug   :false
})

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = (req, res) =>{
    const {id, password} = req.body;
    //로그인 유효성검사
    pool.query('SELECT password FROM user WHERE id = "' + id + '"', (err, row)=>{
        if(err) return console.log(err)
        else if(row[0] !== undefined){
            const match = bcrypt.compareSync(password, row[0].password)   
            if(match){
                try {
                    //access Token 발급
                        const accessToken = jwt.sign({id},process.env.ACCESS_SECRET, {
                            expiresIn : '30m',
                            issuer : 'adminHJ'
                        })
                    //refresh Token 발급
                        const refreshToken = jwt.sign({id},process.env.REFRESH_SECRET, {
                            expiresIn : '60days',
                            issuer : 'adminHJ'
                        })
                    //Token 전송
                    res.cookie("accessToken", accessToken, {
                        secure : false,
                        httpOnly : true,
                    })
                    res.cookie("refreshToken", refreshToken, {
                        secure : false,
                        httpOnly : true,
                    })
                    res.status(200).json('login success')
                    res.sendFile(__dirname+'/public/')
                } catch (err) {
                    res.status(500).json(err);
                }
            } else{
            //비밀번호 불일치
            res.send("<script>alert('아이디 혹은 비밀번호가 일치하지 않습니다.');location.href = document.referrer;</script>");
        }
        } else{
        //존재하지 않는 계정
        res.send("<script>alert('아이디가 존재하지 않습니다.');location.href = document.referrer;</script>");
        }
    })}

const accessToken = (req, res) =>{
    re
}

const refreshToken = (req, res) =>{
    //accessToken 갱신
    try {

    } catch (err) {

    }
}

const loginSuccess = (req, res) =>{
    
}

const logout = (req, res) =>{
    
}

module.exports = {
    login,
    accessToken,
    refreshToken,
    loginSuccess,
    logout,
}