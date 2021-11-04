// 返回 Hello World
const cloudbase = require("@cloudbase/node-sdk"); 
const app = cloudbase.init({
    env: cloudbase.SYMBOL_URRENT_ENV,
});
const db = app.database()
const _ = db.command
const MAX_LIMIT = 100

exports.main = async (event,context) => {

  let query = {}
  // 设置分页
  let depagesize = (event.page-1) * event.pagesize
  
  //名称模糊搜索
  if (event.name && /^(\s*\S+\s*)+$/.test(event.name)) {
    // title不为空字符串
    query.employee = app.database().RegExp({
      regexp: event.name,
      options: 'i', //大小写不区分
    })
  }
  console.log('当前参数',event)
  if(event.selected == 1){
    query.create_time = _.gte(event.create_time)
  }else if(event.selected == 2){
    query.create_time = _.and(_.gte(event.sevenTime),_.lte(event.today))
  }else if(event.selected == 3){
    query.create_time = _.and(_.gte(event.thirtyTime),_.lte(event.today))
  }
  
  //电话号码模糊搜索
  if (event.tel) {
    // title不为空字符串
    query.member_tel = app.database().RegExp({
      regexp: event.tel,
      options: 'i', //大小写不区分
    })
  }
  //卡号模糊搜索
  if (event.cardNo) {
    // title不为空字符串
    query.card_no = app.database().RegExp({
      regexp: event.cardNo,
      options: 'i', //大小写不区分
    })
  }
  if(event.sub_id){
    query.sub_id = event.sub_id
  }
  if(event.sstate){
    query.state = _.lt(2)
  }
  //如果存在时间区间
  if(event.startTime && event.endTime){
    query.update_time = _.and(_.gte(event.startTime),_.lte(event.endTime))
  }
  let orderstr='_id'
  let ordertype='asc'
  //如果存在排序方式
  if(event.ordertype&&event.ordertype=="desc"){
    ordertype='desc'
  }

  //如果存在排序字段
  let allowstr=['_id','create_time','count','lowprice']
  if(event.orderstr&&allowstr.indexOf(event.orderstr)!=-1){
    orderstr=event.orderstr
  }
  if(!event.page){
    //先取出集合记录总数
    const countResult = await db.collection('deduct_record').count()
    const total = countResult.total
    //计算需分几次取
    const batchTimes = Math.ceil(total/100)
    //承载所有读操作的promise的数组
    const tasks = []
    for(let i = 0;i<batchTimes;i++){
      const promise = db.collection('deduct_record').skip(i*MAX_LIMIT).limit(MAX_LIMIT).where(query).orderBy('create_time','desc').get()
      tasks.push(promise)
    }
    return(await Promise.all(tasks)).reduce((acc,cur) => {
      return{
        data:acc.data.concat(cur.data),
        errMsg:acc.errMsg
      }
    })
  }else{
    const result = await db.collection('deduct_record').skip(depagesize).limit(event.pagesize)
    .orderBy(orderstr, ordertype).where(query).get()
    return result
  }
  
}



