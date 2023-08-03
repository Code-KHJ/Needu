const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_all, Corp_info, Hash_info} = require("./middleware/corp");
const {midCareerType} = require("./middleware/user");
const {corp, Add_Corp} = require("./controllers/corp");
const { write, write_auth } = require("./controllers/review");


router.get('/', auth, (req, res)=>{
  res.render(rootdir+'/public/write_search.html', {User: req.user})
})

router.get('/all', Corp_all, corp);

router.post('/add', Add_Corp);

router.get('/corp/:name', auth, Corp_info, Hash_info, midCareerType, write_auth);

router.post('/corp/:name', auth, write);

module.exports = router;


/**
 * @swagger
 * /review/write/all:
 *   get:
 *     tags: [Corp]
 *     name: load all corp
 *     summary: 기관리스트 불러오기
 *     responses:
 *       '200':
 *         description: load all corp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 corp:
 *                   type: array
 * /review/write/add:
 *   post:
 *     tags: [Corp]
 *     summary: 기관 추가하기
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Corp_name:
 *                 type: string
 *               city:
 *                 type: string
 *               gugun:
 *                 type: string
 *     responses:
 *       '200':
 *         description: "기관등록 완료"
 *       '400':
 *         description: "이미 등록된 기관"
 *       '500':
 *         description: "오류 발생"
 * 
 * /review/write/corp/{corp_name}:
 *   get:
 *     tags: [Write]
 *     summary: 리뷰 페이지 로드
 *     parameters:
 *       - in: path
 *         name: corp_name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: "요청 성공"
 *       '401':
 *         description: "로그인 필요"
 *       '404':
 *         description: "존재하지 않는 기관"
 *   post:
 *     tags: [Write]
 *     summary: 리뷰 작성
 *     parameters:
 *       - in: path
 *         name: corp_name
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_date:
 *                 type: string
 *               last_date:
 *                 type: string
 *               work_type:
 *                 type: string
 *               growth:
 *                 type: integer
 *               leadership:
 *                 type: integer
 *               reward:
 *                 type: integer
 *               worth:
 *                 type: integer
 *               culture:
 *                 type: integer
 *               worklife:
 *                 type: integer
 *               highlight:
 *                 type: string
 *               pros:
 *                 type: string
 *               cons:
 *                 type: string
 *     responses:
 *       '200':
 *         description: "리뷰 작성 완료"
 *       '400':
 *         description: "리뷰 작성 오류"
 *       '500':
 *         description: "서버 오류"
*/
