const app = getApp()
const db = wx.cloud.database()
const _ = db.command
/*
  获取订单列表
 */
function list(obj) {
  return new Promise(function(resolve, reject) {
    let query = {}
    console.log('此时的状态为',obj.state,obj)
    if(obj.state){
      query.state = obj.state
    }

    if(obj.curEmployee !== ''){
      query.employee = obj.curEmployee
    }
    if(obj.year !== 0 && obj.month == 0 && obj.day == 0){
      query.year = obj.year
    }else if(obj.year !== 0 && obj.month !== 0 && obj.day ==0){
      query.year = obj.year
      query.month = obj.month
    }else if(obj.year !== 0 && obj.month !== 0 && obj.day !==0){
      query.year = obj.year
      query.month = obj.month
      query.date = obj.day
    }
    if(obj.de_type){
      query.de_type = obj.de_type
    }
    if (obj.title&&/^(\s*\S+\s*)+$/.test(obj.title)) {
    // title不为空字符串
      query.title=db.RegExp({
        regexp: obj.title,
        options: 'i',//大小写不区分
      })
    }
    let depagesize = obj.page * obj.pagesize
    db.collection('deduct_record').where(query).limit(obj.pagesize).skip(depagesize).orderBy('create_time','desc').get().then(res => {
      resolve(res.data)
    })
  })
}
module.exports = {
  list,
}