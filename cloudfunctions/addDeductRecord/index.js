// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  //获取当前的时间
  var date = new Date()
  const employee = await db.collection('member').where({
    position:3
  }).get()
  console.log(employee,employee.length)
  let name = ''
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let m =month<10?('0'+month):month
  let day = date.getDate()
  let d = day<10?('0'+day):day
  
  let h = date.getHours()
  h = h<10 ?('0'+h):h
  let minute = date.getMinutes()
  minute = minute<10?('0' + minute):minute
  let second = date.getSeconds()
  second = second<10?('0'+second):second
  let currentTime = year+'-'+m+'-'+d+' '+h+':'+minute+':'+second
  for(let i = 0;i<employee.data.length;i++){
    name = employee.data[i].name
    await db.collection('deduct_record')
    .add({
      data:{
        employee:name,
        price:0,
        de_money:0,
        goodsname:'',
        goods_no:0,
        goods_type:0,
        de_type:'',
        de_rate:0,
        order_no:'',
        member_openid:'',
        member_name:'',
        member_tel:'',
        state:0,
        create_time:currentTime,
        update_time:currentTime,
        year:year,
        month:month,
        date:day
      }
    })
  }
  
}