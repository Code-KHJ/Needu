const express = require("express");
const router = express.Router();
const {signup, duplic ,mailAuth} = require("./controllers/user");
const {auth} = require("./middleware/auth");
const rootdir = require("../modules/path");
const path = require('path');


router.get('/', auth, (req,res)=>{
  if(req.user){
    res.redirect("/")    
  }else{
    res.sendFile(rootdir+'/public/signup.html')
  }})

router.post('/', signup)

router.post('/duplic', duplic)

router.post('/mail', mailAuth)

module.exports = router;


/**
 * @swagger
 * /signup:
 *   post:
 *     tags: [User]
 *     summary: 회원가입 요청
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               password:
 *                 type: string
 *               phonenumber:
 *                 type: string
 *               nickname:
 *                 type: string
 *               check_2:
 *                 type: boolean
 *               check_3:
 *                 type: boolean
 *               check_4:
 *                 type: boolean
 *               check_5:
 *                 type: boolean
 *               radio1:
 *                 type: string
 *     responses:
 *       '200':
 *         description: "회원가입 완료"
 *       '400':
 *         description: "가입 폼 잘못된 작성"
 *       '500':
 *         description: "오류 발생"
 * 
 * /signup/duplic:
 *   post:
 *     tags: [User]
 *     summary: 아이디 중복 확인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               check:
 *                 type: string
 *               checkId:
 *                 type: string
 *               checkName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: "중복 조회 정상"
 *         content:
 *           text/plain:
 *             schma:
 *               type: integer
 *       '400':
 *         description: "클라이언트 작성 오류"
 *       '500':
 *         description: "오류 발생"
 * 
 * /signup/mail:
 *   post:
 *     tags: [User]
 *     summary: 이메일 인증번호 요청
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *     responses:
 *       '200':
 *         description: "인증메일 정상 발송"
*/