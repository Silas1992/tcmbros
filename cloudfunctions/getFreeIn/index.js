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

  //散客的条件
  if(event.type == 1){
    query.card_no = ""
  }else if(event.type == 2){
    query.goods_type = 3
  }else if(event.type == 3){
    query.goods_type = 5
  }else if(event.type == 4){
    query.de_type = '按次服务'
  }
  


  console.log('当前参数',event)
  if(event.selected == 1){
    query.create_time = _.gte(event.create_time)
  }else if(event.selected == 2){
    query.create_time = _.and(_.gte(event.sevenTime),_.lte(event.today))
  }else if(event.selected == 3){
    query.create_time = _.and(_.gte(event.thirtyTime),_.lte(event.today))
  }else{
    query.create_time = _.and(_.gte(event.startTime),_.lte(event.endTime))
  }
  const $ = db.command.aggregate
  return await db.collection('buy_record').aggregate().match(query)
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