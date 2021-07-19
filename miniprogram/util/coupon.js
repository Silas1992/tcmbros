const db = wx.cloud.database();
const _ = db.command;
/*
  获取商品分类列表
 */
function list(obj) {
  return new Promise(function(resolve, reject) {
    let query = {}
    if(obj.openid){
      query._openid = obj.openid
    }
    //根据优惠券状态筛选
    if(obj.present == 1){
      query.status = obj.present
    }
    if(obj.present == 2){
      query.usedTime = _.gt(0)
      query.status = _.neq(3)
    }
    if(obj.present == 3){
      query.status = 3
    }

    if (obj.title&&/^(\s*\S+\s*)+$/.test(obj.title)) {
      // title不为空字符串
      query.title=db.RegExp({
        regexp: obj.title,
        options: 'i',//大小写不区分
      })
    }
    let depagesize = obj.page * obj.pagesize
    console.log('参数',query,obj.pagesize,depagesize)
    db.collection('my_coupon').orderBy('create_time','desc')
    .where(query).limit(obj.pagesize).skip(depagesize).get().then(res => {
      resolve(res.data)
    })
  })
}


module.exports = {
  list
}