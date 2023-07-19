const { Corp_info, Corp_all, Hash_info, top10_corp, sidebar_corp, sidebar_review } = require('../../modules/sql');
const rootdir = require("../../modules/path");


module.exports = {
  Corp_info: async (req, res, next) => {
    const Corp_name = req.params.name;
    try{
      const info = await Corp_info(Corp_name);
      if (info.name !== null){
        req.corp = info;
        next();
      } else {
        next();
      }  
    } catch(err){
      console.error(err)
    }
  },
  Corp_all: async(req, res, next) => {
    try{
      const corp = await Corp_all()
      req.corp = corp
      next()  
    } catch(err){
      console.error(err)
    }
  },
  Hash_info: async (req, res, next) => {
    const Corp_name = req.params.name;
    try{
      const Hash = await Hash_info(Corp_name);
      if (Hash[0] !== null){
        req.hash = Hash;
        next();  
      } else {
        next();
      }  
    } catch(err){
      console.error(err)
    }
  },
  mid_top10_corp: async(req, res, next) => {
    const avg_total = "avg_total";
    try{
      const top10 = await top10_corp(avg_total);
      req.top10 = top10
      next()  
    }catch(err){
      console.error(err)
    }
  },
  // mid_sidebar_corp: async (req, res, next) => {
  //   try{
  //     const corp = await sidebar_corp();
  //     const review = await sidebar_review();
  //     next()
  //   } catch(err){
  //     console.error(err)
  //   }
  // },
  mid_top10_detail: async(req, res, next) => {
    if(req.query.data){
      const detail_item = req.query.data;
      const detail10 = await top10_corp(detail_item);
      req.detail10 = detail10;
      req.tf = true;
      next();
    } else{
      const default_item = "avg_growth";
      const detail10 = await top10_corp(default_item);
      req.detail10 = detail10;
      req.tf = false;
      next();
    }
  }
}
