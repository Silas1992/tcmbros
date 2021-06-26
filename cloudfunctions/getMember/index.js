// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let query = {}
  if(!event.page) event.page=1
  if(!event.pagesize) event.pagesize=20
  // 设置分页
  let depagesize = (event.page-1) * event.pagesize
  //电话号码模糊搜索
  if (event.tel) {
    // title不为空字符串
    query.tel = cloud.database().RegExp({
      regexp: event.tel,
      options: 'i', //大小写不区分
    })
  }
  //名称模糊搜索
  if (event.title && /^(\s*\S+\s*)+$/.test(event.title)) {
    // title不为空字符串
    query.title = cloud.database().RegExp({
      regexp: event.title,
      options: 'i', //大小写不区分
    })
  }
  //如果根据姓名查询
  if(event.name){
    query.name = event.name
  }
  //如果存在分类编号
  if(event.position){
    query.position =event.position 
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
  return cloud.database().collection('member').skip(depagesize).limit(event.pagesize).orderBy(orderstr, ordertype).where(query).get({
    success: function (res) {
      return res;
    },
    fail(error) {
      return error;
    }
  })
}