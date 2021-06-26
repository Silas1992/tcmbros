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
  return await db.collection('buy_record')
  .add({
    data:{
      goods_name:'自定义充值',
      order_no:'',
      goods_type:4,
      price:event.price,
      employee:'',
      member_id:event.memberOpenId,
      member_name:event.memberName,
      member_tel:event.memberTel,
      state:2,
      pay_type:'手机管理端',
      remark:'',
      create_time:currentTime,
      update_time:currentTime,
      sub_id:event.sub_id,
      year:year,
      month:month
    }
  })
}