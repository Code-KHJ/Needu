const express = require("express");
const router = express.Router();
const rootdir = require("../modules/path");
const {auth} = require("./middleware/auth");
const {Corp_info, Hash_info, mid_top10_corp, mid_top10_detail} = require("./middleware/corp");
const { review_content, review_auth, mid_review_recent, mid_search_result } = require("./middleware/review");
const { review_detail, review_more, review_likes, con_top10_detail, con_review_search } = require("./controllers/review");



router.get("/search", auth, mid_search_result, con_review_search)

router.get('/detail', auth, mid_top10_detail, con_top10_detail)

router.get('/corp/:name', auth, Corp_info, Hash_info, review_content, mid_top10_corp, review_detail)

router.get('/corp/:name/more',auth, review_content, review_auth, review_more)

router.post('/corp/:name/likes', auth, review_auth, review_likes)

module.exports = router;


/**
 * @swagger
 * /review/search:
 *   get:
 *     tags: [Review]
 *     summary: 기관검색
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: score
 *         schema:
 *           type: integer
 *       - in: query
 *         name: hashtag
 *         schema:
 *           type: string
 *       - in: query
 *         name: corp_name
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: "조회 성공"
 * 
 * /review/corp/{corp_name}:
 *   get:
 *     tags: [Review]
 *     summary: 리뷰 상세페이지
 *     parameters:
 *       - in: path
 *         name: corp_name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: "요청 성공"
 *       '404':
 *         description: "존재하지 않는 기관"
 * 
 * /review/corp/{corp_name}/more:
 *   get:
 *     tags: [Review]
 *     summary: 리뷰 상세페이지 더보기
 *     parameters:
 *       - in: path
 *         name: corp_name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: "요청 성공"
 *       '204':
 *         description: "접근 권한 없음"
 *       '401':
 *         description: "로그인 필요"
 * 
 * /review/corp/{corp_name}/likes:
 *   post:
 *     tags: [Review]
 *     summary: 리뷰 좋아요
 *     parameters:
 *       - in: path
 *         name: corp_name
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               num:
 *                 type: integer
 *               likes:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: "요청 성공"
 *       '401':
 *         description: "로그인 필요"
 *       '500':
 *         description: "오류 발생"
*/