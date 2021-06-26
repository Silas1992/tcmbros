// miniprogram/pages/manage/statistics/statistics.js
var TIME = require('../../../util/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    today:true,
    seven:false,
    thirty:false,
    custom:false,
    orders:[],
    startDate:0,
    endDate:0,

    pagesize: 10,
    page: 0,
    keyword: '',
    islast: false,
  },
  bindStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value.replace(/-/g,'/')//利用正则替换
    })
    //判断两个时间有没有都选择，并且结束时间大于开始时间
    let endDate = this.data.endDate
    if(endDate != 0){
      if(endDate>=this.data.startDate){
        this.getData()
      }else{
        wx.showToast({
          icon:"none",
          title: '日期区间有误，请重新选择日期！',
        })
      }
      
    }
  },
  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value.replace(/-/g,'/')
    })
    //判断两个时间有没有都选择，并且结束时间大于开始时间
    let startDate = this.data.startDate
    if(startDate != 0){
      if(this.data.endDate>=startDate){
        this.getData()
      }else{
        wx.showToast({
          icon:"none",
          title: '日期区间有误，请重新选择日期！',
        })
      }
    }
  },
  //点击7天的按钮
  selectSeven:function(e){
    let seven = this.data.seven
    if(seven){
      this.setData({
        today:true,
        seven:false,
        thirty:false,
        custom:false,
      })
      this.getData()
    }else{
      this.setData({
        today:false,
        seven:true,
        thirty:false,
        custom:false,
        startDate:0,
        endDate:0,
      })
      this.getData()
    }
  },
  selectCustom:function(e){
    let custom = this.data.custom
    if(custom){
      this.setData({
        today:true,
        seven:false,
        thirty:false,
        custom:false,
      })
      this.getData()
    }else{
      this.setData({
        today:false,
        seven:false,
        thirty:false,
        custom:true,
        startDate:0,
        endDate:0,
        orders:[]
      })
    }

  },
  //点击30天的按钮
  selectThirty:function(e){
    let thirty = this.data.thirty
    if(thirty){
      this.setData({
        today:true,
        seven:false,
        thirty:false,
        custom:false,
      })
      this.getData()
    }else{
      this.setData({
        today:false,
        seven:false,
        thirty:true,
        custom:false,
        startDate:0,
        endDate:0,
      })
      this.getData()
    }
  },

  //获取统计数据
  getData:function(e){
    wx.showLoading({
      title: '加载中...',
    })
    var selected = 1
    if(this.data.seven){
      selected = 2
    }else if(this.data.thirty){
      selected = 3
    }else if(this.data.custom){
      selected = 4
    }
    let pagesize = this.data.pagesize
    let page = this.data.page

    var myDate = new Date()
    var currentTime = TIME.formatTime(myDate,'Y/M/D h:m:s')
    var today = TIME.formatDate(new Date())+" 23:59:59"
    var sevenTime = "00"
    var thirtyTime = "00"
    var startTime = "00"
    var endTime = "00"
    if(selected == 1){//默认selected为1,遍历当天数据
      currentTime = TIME.formatTimeToday(myDate,'Y/M/D h:m:s')
    }else if(selected == 2){//当selected为2，遍历近一周的数据
      //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
      var seventime=(new Date).getTime()-24*60*60*1000*6;
      sevenTime = TIME.formatDate(new Date(seventime))+" 00:00:00"
    }else if(selected == 3){//当selected为3，遍历近一个月的数据
      var thirtytime=(new Date).getTime()-24*60*60*1000*29;
      thirtyTime = TIME.formatDate(new Date(thirtytime))+" 00:00:00"
    }else{//当selected为4或者其他值的时候遍历自定义日期区间的数据
      startTime = this.data.startDate+" 00:00:00"
      endTime = this.data.endDate+" 23:59:59"
    }
    var that = this
    wx.cloud.callFunction({
      name:'statistics',
      data:{
        pagesize:pagesize,
        page:page,
        selected:selected,
        create_time:currentTime,
        today:today,
        sevenTime:sevenTime,
        thirtyTime:thirtyTime,
        startTime:startTime,
        endTime:endTime,
      },
      success:function(res){
        var data = res.result
        // if (data.length < pagesize) {
        //   that.setData({
        //     tip: '全部数据',
        //     loading: false,
        //     next: false,
        //     islast: true,
        //   })
        // }
        // var orders = that.data.orders
        // orders = orders.concat(data)
        console.log('此时的订单为',data)
        that.setData({
          orders:data
        })
        wx.hideLoading({
          complete: (rs) => {
          },
        })
      },
      fail:err=>{
        wx.hideLoading({
          complete: (err) => {
          },
        })
        console.log("提交失败",err)
      }
    })
  },
  //云函数获取我的订单列表
  getAllOrder:function(e){
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    wx.cloud.callFunction({
      name:'getOrders',
      data:{
        selected:4,
        create_time:'2021/02/02 11:20:19'
      },
      success:function(res){
        let orders = res.result.data
        if(orders.length === 0){
          that.setData({
            haveOrder:true,
          })
        }
        that.setData({
          orders:orders,
        })
        wx.hideLoading({
          complete: (res) => {
            console.log(that.data.orders)
          },
        })
      },
      fail:err=>{
        wx.showToast({
          icon:'none',
          title: '数据量太大，统计失败',
          duration:2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getAllOrder()
    //展示商品列表
    this.getData()
    //this.reloadtable();
  },
  reloadtable() {
    this.setData({
      page: 0,
      list: []
    })
    this.getData()
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.islast) return;
    var page = this.data.page + 1;
    this.setData({
      next: true,
      page: page
    })
    //this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})