const express = require("express");
const router = express.Router();
const {login, findId, mailAuthPw, resetPw} = require("./controllers/user");
const {auth} = require("./middleware/auth");
const rootdir = require("../modules/path");


router.get('/', auth, (req,res)=>{
  if(req.user){
    res.redirect("/")
  }else{
    res.cookie('returnPage', req.header("referer"))
    res.sendFile(rootdir+'/public/login.html')
  }})
router.post('/', login)

router.post('/find/id', findId)
router.post('/find/pw', mailAuthPw)
router.post('/update/pw', resetPw)



module.exports = router;


/**
 * @swagger
 * /login:
 *   post:
 *     tags: [User]
 *     name: log in
 *     summary: user log in
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
 *     responses:
 *       '200':
 *         description: "로그인 성공"
 *       '404':
 *         description: "클라이언트 입력정보 불일치"
 *       '500':
 *         description: "오류 발생"
*/