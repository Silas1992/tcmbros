const app = getApp()
const db = wx.cloud.database()
const _ = db.command
/*
  获取商品分类列表
 */
function list(obj) {
  return new Promise(function(resolve, reject) {
    let query = {}
    query.type = 2
    if(obj.present){
      query.state = 2
    }else{
      query.state = _.gt(2).or(_.eq(1))
    }

    if(!obj.isManage){
      query.employee = obj.employee
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
    db.collection('deduct_record').orderBy('create_time','desc').where(query).limit(obj.pagesize).skip(depagesize).get().then(res => {
      resolve(res.data)
      console.log('在util中的',res.data)
    })
  })
}
/*
  获取商品分类列表
 */
function listall() {
  return new Promise(function(resolve, reject) {
    let query = {}
    db.collection('deduct_record').where(query).get().then(res => {
     
      resolve(res.data)
    })
  })
}



/*
  添加商品分类
  title-标题
  content:描述
  faceimage:封面图片
  create_time-添加时间
  sort int 顺序
  isshow int 是否显示
  update_time 更新时间
  _openid
 */
function add(obj) {
  return new Promise(function(resolve, reject) {
    obj.update_time=obj.create_time=new Date().getTime()
    db.collection('deduct_record').add({
      data: obj
    }).then(res => {
      resolve(res)
    })
  })
}

/*
  编辑商品分类
  title-标题
  content:描述
  faceimage:封面图片
  create_time-添加时间
  update_time 更新时间
  sort int 顺序
  isshow int 是否显示
  _openid
 */
function modify(obj) {
  return new Promise(function(resolve, reject) {
    let _id=obj._id
    delete obj._id
    obj.update_time=new Date().getTime()
    db.collection('deduct_record').doc(_id).update({
      data: obj,
      success: function (res) {
        console.log(res)
        resolve(res)
      }
    })
  })
}
/*
  删除商品分类
  id
 */
function mydelete(obj) {
  return new Promise(function (resolve, reject) {
    db.collection('deduct_record').doc(obj.id).remove({
      success: function (res) {
        resolve({ status:1,'info':'删除成功'})
      }
    })
  })
}

/*
  查看商品分类详情
  id
 */
function detail(obj) {
  return new Promise(function(resolve, reject) {
    db.collection('deduct_record').doc(obj._id).get().then(res => {
      console.log(res)
      resolve(res)
    })
  })
}

module.exports = {
  list,
  listall,
  add,
  modify,
  detail,
  mydelete
}