// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  
  try {
    //这里需要在data中传入会员_id
    return await db.collection('member').where({
      balance:_.gt(0)
    }).get()
  } catch (error) {
    console.error(error)
  }
}