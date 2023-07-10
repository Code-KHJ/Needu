const jwt = require('../../modules/jwt');
const redisClient = require("../../modules/redis");
const url = require('url')
const secret = process.env.JWT_KEY;
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dbconfig = require("../../config/dbconfig.json");
const { body, validationResult } = require("express-validator");
const { use } = require('..');
const rootdir = require("../../modules/path");
const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const dotenv = require('dotenv');
dotenv.config({path: path.resolve(rootdir + '/config/.env')});


// Database connection pool
const pool = mysql.createPool({
  host    : dbconfig.host,
  user    : dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
  connectionLimit: 100,
  debug   :false
})

process.on('uncaughtException', (err)=>{
  console.error(err)
})

module.exports = {
  login: async (req, res) => {
    const {id, password} = req.body;
    const returnUrl = req.cookies.returnPage
    const returnPath = url.parse(returnUrl).pathname;
    try{
      pool.query('SELECT id, password, nickname FROM user WHERE id = "' + id + '"', (err, row)=>{
        if(err) return console.log(err)
        else if(row[0] !== undefined){
          const match = bcrypt.compareSync(password, row[0].password)
          if(match){
            try {
              //access Token 발급
              const accessToken = jwt.sign(row[0].id, row[0].nickname);
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
              const current = new Date().toISOString().slice(0, 10);
              pool.query(`UPDATE user SET login_date = "${current}" WHERE id = "${id}"`);
              if(returnPath == undefined || returnPath == "/signup" || returnPath == "/login"){
                return res.status(200).send("<script>alert('"+row[0].nickname+"님 반갑습니다!');location.href = '/';</script>")
              }else{
                return res.status(200).send("<script>alert('"+row[0].nickname+"님 반갑습니다!');location.href = '"+returnPath+"';</script>")
              }
            } catch (err) {
              res.status(500).json({err});
            }
          } else{
          //비밀번호 불일치
          res.send("<script>alert('아이디 혹은 비밀번호가 일치하지 않습니다.');history.go(-1)</script>");
        }
        } else{
        //존재하지 않는 계정
        res.send("<script>alert('아이디가 존재하지 않습니다.');history.go(-1);</script>");
        }
      })
    } catch(err){
      console.error(err)
    }
    //로그인 유효성검사
  },
  logout: (req,res) => {
    if(req.cookies.AccessToken){
      try{
        const id = jwt.verify(req.cookies.AccessToken).id
        const userid = req.user.id
        if(id !== undefined){
          redisClient.del(id);
          res.clearCookie('AccessToken');
          res.clearCookie('RefreshToken');
          res.redirect("/");
        }
        else if(userid){
          redisClient.del(userid)
          res.clearCookie('AccessToken')
          res.clearCookie('RefreshToken')
          res.redirect("/")    
        }
      }catch (err){
        res.status(500).json({err})
      }
    }else{
      res.redirect("/")
    }
  },
  signup: (req,res) => {
    checkbody = [
      body('id').trim().notEmpty().isEmail().withMessage("아이디 오류"),
      body('password').trim().notEmpty().isLength({min:8, max:16}).withMessage("비밀번호 오류"),    
      body('phonenumber').trim().notEmpty().isMobilePhone('any').withMessage("휴대폰번호 오류"),
      body('nickname').trim().notEmpty().isLength({min:2}).withMessage("닉네임 오류"),
    ]
    const err = validationResult(checkbody);
    if (!err.isEmpty()){
      return res.status(400).json({ err : err.array()});
    }
    const user_info = {
      id : req.body.id,
      password : req.body.password,
      phonenumber : req.body.phonenumber,
      nickname : req.body.nickname,
      authority : 0,
      required_check1 : Boolean(req.body.check_2),
      required_check2 : Boolean(req.body.check_3),
      optional_check1 : Boolean(req.body.check_4),
      optional_check2 : Boolean(req.body.check_5),
      info_period : req.body.radio1,
    }
    try{
      pool.query('SELECT id FROM user WHERE id = "' + user_info.id + '"', (err, row)=>{
        if (row[0] == undefined){ //동일한 아이디가 없을 경우
          const salt = bcrypt.genSaltSync(saltRounds);
          const hashPw = bcrypt.hashSync(user_info.password, salt);
          const sql = `
            insert into user (id, password, phonenumber, nickname, authority, policy, personal_info, marketing_email, marketing_SMS, info_period) values (?,?,?,?,?,?,?,?,?,?)
          `
          const data = [
            user_info.id, hashPw, user_info.phonenumber, user_info.nickname, user_info.authority, user_info.required_check1,
            user_info.required_check2, user_info.optional_check1, user_info.optional_check2, user_info.info_period
          ];
          pool.query(sql, data, (err, rows, fields)=>{
            if(err) return res.json({ success: false, err})
            return res.status(200).send("<script>alert('회원가입이 완료되었습니다. 로그인하신 후 서비스를 이용해주세요');location.href = '/login';</script>");
          })
        }
          else {
            res.json({ success: false, err}) //아이디 중복일 때 에러 부분 추후 자바스크립트로 구현 필요
            res.send("<script>alert('중복된 아이디가 있습니다.');location.href = document.referrer;</script>");
          }
      })
    } catch(err){
      console.error(err)
    }
  },
  duplic: (req,res) => {
    const check = req.body.check
    const checkId = req.body.checkId
    const checkName = req.body.checkName
    let result = 1
    try{
      if(check == "id"){
        pool.query('SELECT id FROM user WHERE id = "' + checkId + '"', (err, row)=>{
          if(row[0] == undefined){
            res.send(JSON.stringify(result))
          } else{
            result = 2
            res.send(JSON.stringify(result))
          }
        })
      } else{
        if(check == "nickname"){
          pool.query('SELECT nickname FROM user WHERE nickname = "' + checkName + '"', (err, row)=>{
            if(row[0] == undefined){
              res.send(JSON.stringify(result))
            } else{
              result = 2
              res.send(JSON.stringify(result))
            }
          })
        }
      }
    } catch(err){
      console.error(err)
    }
  },
  mailAuth: (req, res) => {
    let authNum = Math.random().toString().substr(2,6);
    let emailTemplate;
    ejs.renderFile(rootdir+'/template/autoMail.ejs', {authCode : authNum}, function(err, data){
      if(err){console.log(err)}
      emailTemplate = data
    });
  
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      }
    });
  
    let mailOptions = {
      from: `needu`,
      to: req.body.mail,
      subject: '[Needu] 회원가입을 위한 인증번호입니다.',
      html: emailTemplate,
    };
    
    transporter.sendMail(mailOptions, function (err, info){
      if(err){console.log(err)};
      console.log('finish sending : ' + info.response);
      transporter.close()
    });
    return res.json({authCode: authNum});
  },
}