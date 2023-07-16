const express = require("express");
const router = express.Router();
const {userData, changePw} = require("./controllers/user");
const {auth} = require("./middleware/auth");
const {mid_User_all, mid_User_career} = require("./middleware/user");
const rootdir = require("../modules/path");


router.get("/profile", auth, mid_User_all, mid_User_career, userData);

router.post('/change/pw', auth, changePw)

router.post('/change/userinfo', auth, (req, res)=>{
  console.log(req.body);
})


/**
 * @swagger
 * /change/pw:
 *   post:
 *     tags: [User]
 *     summary: 비밀번호 변경
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: "비밀번호 완료"
 *       '400':
 *         description: "비밀번호 일치하지 않음"
 *       '401':
 *         description: "로그인 필요"
 *       '500':
 *         description: "서버 오류"
*/

module.exports = router;