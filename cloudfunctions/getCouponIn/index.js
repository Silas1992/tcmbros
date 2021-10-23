// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let query = {}

  query.de_type = '按次服务'

  if(event.selected == 1){
    query.create_time = _.gte(event.create_time)
  }else if(event.selected == 2){
    query.create_time = _.and(_.gte(event.sevenTime),_.lte(event.today))
  }else if(event.selected == 3){
    query.create_time = _.and(_.gte(event.thirtyTime),_.lte(event.today))
  }
  const $ = db.command.aggregate
  return await db.collection('deduct_record').aggregate().match(query)
  .group({
    _id:null,
    totalNum:$.sum('$price'),
  }).limit(100).end().then(res=>{
    const result = res.list
    return result
  }).catch(err=>{
    return err;
  })
}