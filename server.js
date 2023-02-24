const express = require("express");
const { body, validationResult } = require("express-validator");
const port = 3000;
const mysql = require("mysql");
const path = require("path");
const static = require("serve-static");
const dbconfig = require("./config/dbconfig.json");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/public", static(path.join(__dirname, "public")));

// Database connection pool
const pool = mysql.createPool({
    host    : dbconfig.host,
    user    : dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    connectionLimit: 10,
    debug   :false
})
//회원가입 시 필요한 정보를 클라이언트에서 가져와서 데이터베이스에 넣어줌
app.post("/register", [
        body('id').trim().notEmpty().isLength({min:4, max:20}).isAlphanumeric().withMessage("아이디 오류"),
        body('password').trim().notEmpty().isLength({min:8, max:16}).withMessage("비밀번호 오류"),    
        body('name').trim().notEmpty().isLength({min:1}).withMessage("이름 오류"),
        body('phonenumber').trim().notEmpty().isMobilePhone('any').withMessage("휴대폰번호 오류"),
        body('email').trim().notEmpty().isEmail().withMessage("이메일 오류")
    ], (req, res) => {
    const err = validationResult(req);
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
                return res.status(200).json({
                    success: true     
                })}
            )
        }
        else {
            res.json({ success: false, err}) //아이디 중복일 때 에러 부분 추후 자바스크립트로 구현 필요
        }
    })
})

app.post("/checkId",(req, res) =>{
    const checkId = req.body.id
    let result = 1
    pool.query('SELECT id FROM user WHERE id = "' + checkId + '"', (err, row)=>{
        if(row[0] == undefined){
            res.send(JSON.stringify(result))
        } else{
            result = 2
            res.send(JSON.stringify(result))
        }
    })})

app.listen(port, () => {console.log(`Server started on port ${port}`)});