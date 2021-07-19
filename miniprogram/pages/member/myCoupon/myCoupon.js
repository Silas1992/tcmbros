// miniprogram/pages/member/myCoupon/myCoupon.js
const app = getApp()
const COUPON = require('../../../util/coupon.js');
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
        name:'未使用',
        isActive:true
      },
      {
        id:1,
        name:'已使用',
        isActive:false
      },
      {
        id:2,
        name:'已过期',
        isActive:false
      }
    ],

    pagesize: 10,
    page: 0,
    keyword: '',
    islast: false,
    next:false,
    
    Mycoupon:[],
    present:1
  },
  
  goback(){
    wx.navigateBack({delata:1})
  },
  //自定义事件
  handleItemChange:function(e){
    const {index} = e.detail
    let {tabs} = this.data
    tabs.forEach((v,i) => i === index ?v.isActive = true : v.isActive = false)
    console.log(tabs)
    this.setData({tabs})
    for(var i in tabs){
      if(tabs[i].isActive && tabs[i].id===0){
        this.setData({
          present:1,
          Mycoupon:[],
          islast:false
        })
        //1.获取订单
        this.reloadtable()
        return
      }
      if(tabs[i].isActive&&tabs[i].id===1){
        this.setData({
          present:2,
          Mycoupon:[],
          islast:false
        })
        //1.获取订单
        this.reloadtable()
        return
      }
      if(tabs[i].isActive&&tabs[i].id===2){
        this.setData({
          present:3,
          Mycoupon:[],
          islast:false
        })
        //1.获取订单
        this.reloadtable()
        return
      }
    }

    
  },
  
  //获取当前订单，利用分页的方法获取
  getdata() {
    const that = this
    let pagesize = that.data.pagesize
    let page = that.data.page
    let present = that.data.present
    let openid = that.data.openid
    console.log(page,pagesize,present,openid)
    wx.showLoading({
      title: '加载中...',
    })
    COUPON.list({
      pagesize,
      page,
      present,
      openid
    }).then(res => {
      if (res.length < pagesize) {
        that.setData({
          tip: '全部数据',
          loading: false,
          next: false,
          islast: true,
        })
      }
      let list = that.data.Mycoupon;
      list = list.concat(res);
      // let currentTime = new Date().getTime()
      // console.log(currentTime)
      // for(var i in list){
      //   let targetTime = list[i].targetTime
      //   //如果当前时间与订单创建时间的时间差小于5分钟,则该订单依旧有倒计时
      //   if(targetTime > currentTime){
      //     list[i].targetTime=targetTime
      //   }else{
      //     list[i].targetTime=currentTime
      //   }
      // }
      that.setData({
        next: false,
        Mycoupon: list,
      })
      console.log('什么鬼',list)
      wx.hideLoading({
        complete: (res) => {},
      })
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
    console.log(openid)
    this.reloadtable()
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  reloadtable() {
    this.setData({
      page: 0,
      Mycoupon: [],
      islast:false
    })
    this.getdata()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})