const express = require("express");
const router = express.Router();
const {signup, duplic} = require("./controllers/user");
const {auth} = require("./middleware/auth");
const rootdir = require("../modules/path");
const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const dotenv = require('dotenv');

dotenv.config({path: path.resolve(rootdir + '/config/.env')});

router.get('/', auth, (req,res)=>{
  if(req.user){
    res.redirect("/")    
  }else{
    res.sendFile(rootdir+'/public/signup.html')
  }})

router.post('/', signup)

router.post('/duplic', duplic)

router.post('/mail', (req, res)=>{
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
})

module.exports = router;