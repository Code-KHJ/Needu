const { user_info, user_career, careerTypeAll, deleteData, checkUser } = require('../../modules/sql');
const rootdir = require("../../modules/path");
const user = require('../controllers/user');


module.exports = {
  mid_User_all: async (req, res, next) => {    
    const userId = req.user.id
    try{
      const userData = await user_info(userId);
      req.userData = userData
      next();
    } catch(err){
      console.error(err)
    }
  },
  mid_User_career: async (req, res, next) => {
    const userId = req.user.id
    try{
      const userCareeer = await user_career(userId);
      req.userCareer = userCareeer
      next();
    } catch(err){
      console.error(err)
    }
  },
  midCareerType: async (req, res, next) => {
    try{
      req.careerType = await careerTypeAll();
      next();  
    } catch(err){
      console.error(err)
    }
  },
  midDeleteCareer: async (req, res, next) => {
    let checkId = await checkUser(req.query.no, 'user_career');
    if(!req.user.id == checkId[0].user_id){
      return res.status(401).send("수정권한 없음")
    }
    try{
      res.result = await deleteData(req.query.no, 'user_career');
      next();
    } catch(err){
      console.error(err)
    }
  }
}