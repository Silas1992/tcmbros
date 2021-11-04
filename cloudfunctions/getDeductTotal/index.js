// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const MAX_LIMIT = 100
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let query = {}
  if(event.state){
    query.state = event.state
  }

  if(event.curEmployee !== ''){
    query.employee = event.curEmployee
  }
  if(event.year !== 0 && event.month == 0 && event.day == 0){
    query.year = event.year
  }else if(event.year !== 0 && event.month !== 0 && event.day ==0){
    query.year = event.year
    query.month = event.month
  }else if(event.year !== 0 && event.month !== 0 && event.day !==0){
    query.year = event.year
    query.month = event.month
    query.date = event.day
  }
  // if(event.de_type){
  //   query.de_type = event.de_type
  // }
  const $ = db.command.aggregate
  return await db.collection('deduct_record').aggregate().match(query)
  .group({
    _id:null,
    totalMoney:$.sum('$de_money'),
  }).end().then(res=>{
    const result = res.list
    console.log(result)
    return result
  }).catch(err=>{
    return err;
  })
}