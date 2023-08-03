const { user_info, user_career, careerTypeAll } = require('../../modules/sql');
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
}