// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (obj, context) => {
  let query = {}
  if(!obj.page) obj.page=1
  if(!obj.pagesize) obj.pagesize=10

  if(obj.position){
    query.position = obj.position
  }
  // 设置分页
  let depagesize = (obj.page-1) * obj.pagesize
  //名称模糊搜索
  if (obj.title && /^(\s*\S+\s*)+$/.test(obj.title)) {
    // title不为空字符串
    query.title = cloud.database().RegExp({
      regexp: obj.title,
      options: 'i', //大小写不区分
    })
  }
  
  return cloud.database().collection('member').skip(depagesize).limit(obj.pagesize).orderBy('create_time', 'desc').where(query).get({
    success: function (res) {
      return res;
    },
    fail(error) {
      return error;
    }
  })
}