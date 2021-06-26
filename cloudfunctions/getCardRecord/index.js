// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let query = {}
  query.member_id = wxContext.OPENID
  if(event.state){
    query.state = event.state
  }
  
  //先取出集合记录总数
  const countResult = await db.collection('buy_record').count()
  const total = countResult.total
  //计算需分几次取
  const batchTimes = Math.ceil(total/100)
  //承载所有读操作的promise的数组
  const tasks = []
  for(let i = 0;i<batchTimes;i++){
    const promise = db.collection('buy_record').skip(i*MAX_LIMIT).limit(MAX_LIMIT).where(query).orderBy('create_time','desc').get()
    tasks.push(promise)
  }
  return(await Promise.all(tasks)).reduce((acc,cur) => {
    return{
      data:acc.data.concat(cur.data),
      errMsg:acc.errMsg
    }
  })
}