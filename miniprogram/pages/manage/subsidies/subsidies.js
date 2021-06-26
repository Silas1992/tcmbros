// miniprogram/pages/store/order/order.js
const app = getApp()
const ORDER = require('../../../util/subs');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH:0,
    member:{},
    isManage:false,
    tabs:[
      {
        id:0,
        name:'待处理',
        isActive:true
      },
      {
        id:1,
        name:'已处理',
        isActive:false
      }
    ],

    pagesize: 10,
    page: 0,
    keyword: '',
    islast: false,
    next:false,
    
    orders:[],
    present:true
  },
  //自定义事件
  handleItemChange:function(e){
    const {index} = e.detail
    let {tabs} = this.data
    tabs.forEach((v,i) => i === index ?v.isActive = true : v.isActive = false)
    this.setData({tabs})
    for(var i in tabs){
      if(tabs[i].isActive&&tabs[i].id===1){
        this.setData({
          present:false,
          orders:[],
          islast:false
        })
        //1.获取订单
        this.reloadtable()
        return
      }else if(tabs[i].isActive&&tabs[i].id===0){
        this.setData({
          present:true,
          orders:[],
          islast:false
        })
        //1.获取订单
        this.reloadtable()
        return
      }
    }
  },

  _toAdd:function(evt){
    wx.navigateTo({
      url: 'add/add',
    })
  },
  goback(){
    wx.navigateBack({delata:1})
  },
  //获取当前订单，利用分页的方法获取
  getdata() {
    const that = this
    let pagesize = that.data.pagesize
    let page = that.data.page
    let title = that.data.keyword
    let present = that.data.present
    let isManage = that.data.member.isManage
    let employee = that.data.member.name
    console.log(page,pagesize,present)
    wx.showLoading({
      title: '加载中...',
    })
    ORDER.list({
      pagesize,
      page,
      title,
      present,
      isManage,
      employee
    }).then(res => {
      console.log(res.length,pagesize)
      console.log(that.data.islast)
      if (res.length < pagesize) {
        that.setData({
          tip: '全部数据',
          loading: false,
          next: false,
          islast: true,
        })
      }
      let list = that.data.orders;
      list = list.concat(res);
      let currentTime = new Date().getTime()
      console.log(currentTime)
      for(var i in list){
        let targetTime = list[i].targetTime
        //如果当前时间与订单创建时间的时间差小于5分钟,则该订单依旧有倒计时
        if(targetTime > currentTime){
          list[i].targetTime=targetTime
        }else{
          list[i].targetTime=currentTime
        }
      }
      that.setData({
        next: false,
        orders: list,
      })

      wx.hideLoading({
        complete: (res) => {},
      })
    })
  },
  //倒计时回调函数
  countDownCallback:function(e){
    var orders = this.data.orders
    //修改对应的ID的订单状态，然后渲染页面
    for(var j in orders){
      let targetTime = orders[j].targetTime
      let id = orders[j]._id
      let currentTime = new Date().getTime()
      if(targetTime < currentTime){
        let state = "orders["+j+"].state"
        this.setData({
          [state]:4
        })
        //调用修改状态的方法
        this.updateStatus(id,4)
      }
    }
  },

  //根据ID修改订单状态,修改为已取消
  updateStatus(orderId,state){
    const db = wx.cloud.database()
    db.collection('deduct_record').doc(orderId).update({
      data:{
        state:state
      },
      success:(res)=>{
        console.log('订单状态已修改为'+state)
      }
    })
  },

  goPay:function(e){
    let id = e.detail.id
    var orders = this.data.orders
    //修改对应的ID的订单状态，然后渲染页面
    for(var j in orders){
      let _id =  orders[j]._id
      if(_id == id){
        let state = "orders["+j+"].state"
        this.setData({
          [state]:1
        })
        //调用修改状态的方法
        this.updateStatus(id,1)
      }
    }
  },
  
  cancel:function(e){
    let id = e.detail.id
    var orders = this.data.orders
    //修改对应的ID的订单状态，然后渲染页面
    for(var j in orders){
      let _id =  orders[j]._id
      if(_id == id){
        let state = "orders["+j+"].state"
        this.setData({
          [state]:3
        })
        //调用修改状态的方法
        this.updateStatus(id,3)
      }
    }
  },
   //查询会员是否存在
   selectMember:function(){
    wx.showLoading({
      title: '加载中...',
    })
    //获取用户的详情
    wx.cloud.callFunction({
      name:'getMemberInfo',
      complete:res=>{
        if(res.result !== undefined){
          let data =  res.result.data
          if(data.length != 0 && data[0].auth){
            var member = data
            this.setData({
              member:member[0],
              isManage:member[0].isManage
            })
            wx.hideLoading({
              success: (res) => {
                console.log('当前用户为',this.data.member)
                //1.获取订单
                this.reloadtable()
              },
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置列表高度
    wx.getSystemInfo({
      complete: (res) => {
        this.data.navH = res.statusBarHeight + 200;
      },fail(err){
        console.log(err);
      }
    })
    let openid = app.globalData.openid
    this.setData({
      navH:this.data.navH,
      openid:openid
    })
    
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectMember()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  reloadtable() {
    this.setData({
      page: 0,
      orders: [],
      islast:false
    })
    this.getdata()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  
   /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('哈哈哈',this.data.islast)
    
  },

  YourFunction:function(){
    if (this.data.islast) return;
    var page = this.data.page + 1;
    this.setData({
      next: true,
      page: page
    })
    this.getdata(page)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})