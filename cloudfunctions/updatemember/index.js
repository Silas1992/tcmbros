// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if(event.balance!=undefined){
      //这里需要在data中传入会员_id
      return await db.collection('member').doc(event._id).update({
        data:{
          update_time:event.updatetime,
          balance:event.balance
        }
      })
    }else if(event.tel!=undefined){
      //这里需要在data中传入会员_id
      return await db.collection('member').doc(event._id).update({
        data:{
          update_time:event.updatetime,
          tel:event.tel
        }
      })
    }else if(event.position != undefined){
      return await db.collection('member').doc(event._id).update({
        data:{
          update_time:event.updatetime,
          position:event.position
        }
      })

    }else if(event.name != undefined){
      return await db.collection('member').doc(event._id).update({
        data:{
          update_time:event.updatetime,
          name:event.name
        }
      })
    }else if(event.nickname!=undefined){
      //这里需要在data中传入会员_id
      return await db.collection('member').doc(event._id).update({
        data:{
          update_time:event.updatetime,
          nickName:event.nickname,
          sex:event.sex,
          language:event.language,
          city:event.city,
          province:event.province,
          country:event.country,
          avatarUrl:event.avatarUrl
        }
      })
    }else{
      //设置管理员后将其修改为管理员
      return await db.collection('member').doc(event._id).update({
        data:{
          update_time:event.updatetime,
          isManage:event.isManage
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}