// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  //获取当前的时间
  var date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let m =month<10?('0'+month):month
  let day = date.getDate()
  let d = day<10?('0'+day):day
  let currentTime = year+'-'+m+'-'+d

  let h = date.getHours()
  h = h<10 ?('0'+h):h
  let minute = date.getMinutes()
  minute = minute<10?('0' + minute):minute
  let second = date.getSeconds()
  second = second<10?('0'+second):second
  let currentTimeNew = year+'-'+m+'-'+d+' '+h+':'+minute+':'+second
  //查询所有的未使用的优惠卷
  const coupon = await db.collection('my_coupon').where({
    status:_.neq(3)
  }).get()
  console.log('此时我的优惠卷为',coupon.data)
  let coupons = coupon.data
  if(coupons.length !== undefined && coupons.length !== 0){
    for(let i = 0;i<coupons.length;i++){
      //判断是否过期
      console.log('今天',currentTime,'过期日期',coupons[i].end_time,
      '今天是否到了过期时间啊！',currentTime>=coupons[i].end_time)
      if(currentTime>=coupons[i].end_time){
        //如果过期修改此条数据的状态
        return await db.collection('my_coupon').doc(coupons[i]._id).update({
          data:{
            update_time:currentTimeNew,
            status:3
          }
        })
      }
    }
  }

  
}