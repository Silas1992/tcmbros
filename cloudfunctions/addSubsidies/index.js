// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  //获取当前的时间
  var date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let m =month<10?('0'+month):month
  let day = date.getDate()
  let d = day<10?('0'+day):day
  
  let h = date.getHours()
  h = h<10 ?('0'+h):h
  let minute = date.getMinutes()
  minute = minute<10?('0' + minute):minute
  let second = date.getSeconds()
  second = second<10?('0'+second):second
  let currentTime = year+'-'+m+'-'+d+' '+h+':'+minute+':'+second
  let targetTime = date.getTime()+7*60000*60*24
  await db.collection('deduct_record')
  .add({
    data:{
      employee:event.name,
      price:0,
      de_money:event.money,
      goodsname:'',
      goods_no:0,
      goods_type:0,
      de_type:event.type,
      de_rate:0,
      order_no:'',
      member_openid:'',
      member_name:'',
      member_tel:'',
      type:2,
      state:2,
      note:event.note,
      create_time:currentTime,
      update_time:currentTime,
      year:year,
      month:month,
      date:day,
      targetTime:targetTime
    }
  })
  
  
}