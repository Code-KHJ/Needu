const jwt = require('../modules/jwt');
const redisClient = require("../modules/redis");
const secret = process.env.JWT_KEY;
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dbconfig = require("../config/dbconfig.json");
const { body, validationResult } = require("express-validator");

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
    },
    signup: (req,res) => {
        checkbody = [
        body('id').trim().notEmpty().isLength({min:4, max:20}).isAlphanumeric().withMessage("아이디 오류"),
        body('password').trim().notEmpty().isLength({min:8, max:16}).withMessage("비밀번호 오류"),    
        body('name').trim().notEmpty().isLength({min:1}).withMessage("이름 오류"),
        body('phonenumber').trim().notEmpty().isMobilePhone('any').withMessage("휴대폰번호 오류"),
        body('email').trim().notEmpty().isEmail().withMessage("이메일 오류")
        ]
        const err = validationResult(checkbody);
        if (!err.isEmpty()){
            return res.status(400).json({ err : err.array()});
        }
        const user_info = {
            id : req.body.id,
            password : req.body.password,
            name : req.body.name,
            phonenumber : req.body.phonenumber,
            email : req.body.email
        }
        pool.query('SELECT id FROM user WHERE id = "' + user_info.id + '"', (err, row)=>{
            if (row[0] == undefined){ //동일한 아이디가 없을 경우
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashPw = bcrypt.hashSync(user_info.password, salt);
                pool.query('insert into user (id, password, name, phonenumber, email) values (?, ?, ?,?,?)',
                    [user_info.id, hashPw, user_info.name, user_info.phonenumber, user_info.email], (err, rows, fields)=>{
                    if(err) return res.json({ success: false, err})
                    // res.send("<script>alert('회원가입이 완료되었습니다.');</script>");
                    return res.status(200).redirect('/login')
                    })}
            else {
                res.json({ success: false, err}) //아이디 중복일 때 에러 부분 추후 자바스크립트로 구현 필요
                res.send("<script>alert('중복된 아이디가 있습니다.');location.href = document.referrer;</script>");
            }
        })
    }}