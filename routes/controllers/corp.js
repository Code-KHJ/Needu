const {Corp_info, Add_corp, check_corp } = require('../../modules/sql');

process.on('uncaughtException', (err)=>{
  console.error(err)
})

module.exports = {
  corp: (req, res) => {
    const corp = req.corp
    res.json({corp})
  },
  Add_Corp: async(req, res)=>{
    console.log(req.body)
    const Corp_name = req.body.Corp_name;
    const Corp_city = req.body.city;
    const Corp_gugun = req.body.gugun;
    const checkInfo = await Corp_info(Corp_name);
    if(checkInfo.name !== null){
      return res.status(400).send("<script>alert('이미 등록된 기관입니다.');location.href = '/review/corp/"+checkInfo.name+"';</script>");
    }
    else{
      const result = await Add_corp(Corp_name, Corp_city, Corp_gugun);
      if(result){
        return res.status(200).send("<script>alert('등록되었습니다. 후기를 작성해주세요.');location.href = '/review/corp/"+Corp_name+"';</script>");
      } else{
        return res.status(500).send("<script>alert('오류가 발생했습니다. 다시 시도해주세요.');location.href = '/reiew/write';</script>");
      }
    }
  },
  check_corp: async (req, res)=>{
    const result = await check_corp(req.query.corp);
    return res.status(200).json({result : result.length})
  }
}