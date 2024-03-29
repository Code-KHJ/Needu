const express = require("express");
const router = express.Router();
const {userData, changePw, changeInfo, changeCareer, addCareer, deleteCareer} = require("./controllers/user");
const {check_corp} = require("./controllers/corp");
const {con_mypage_review, con_mypage_review_edit, con_review_modify, deleteReview} = require("./controllers/review");
const {auth} = require("./middleware/auth");
const {mid_User_all, mid_User_career, midCareerType, midDeleteCareer} = require("./middleware/user");
const {mid_review_edit, midDeleteReview} = require("./middleware/review");
const {Corp_info} = require("./middleware/corp");

const rootdir = require("../modules/path");


router.get("/profile", auth, mid_User_all, mid_User_career, midCareerType, userData);
router.delete("/profile/career", auth, midDeleteCareer, deleteCareer)

router.get("/review", auth, con_mypage_review);
router.delete("/review", auth, midDeleteReview, deleteReview)

router.get("/review/edit", auth, mid_review_edit, Corp_info, midCareerType, con_mypage_review_edit)
router.post("/review/edit", auth, con_review_modify)

router.post('/change/pw', auth, changePw)

router.post('/change/userinfo', auth, changeInfo)

router.post('/change/career', auth, changeCareer)

router.post('/add/career', auth, addCareer)

router.get('/check/corp', auth, check_corp)


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