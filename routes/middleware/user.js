const { user_info, user_career } = require('../../modules/sql');
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
    const userNick = req.user.nickname
    try{
      const userCareeer = await user_career(userNick);
      req.userCareer = userCareeer
      next();
    } catch(err){
      console.error(err)
    }
  }
}