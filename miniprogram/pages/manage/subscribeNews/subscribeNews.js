// miniprogram/pages/manage/subscribeNews/subscribeNews.js
var util = require('../../../util/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:0
  },

  _toSubscribe(){
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: ['F1MYyI3N6x6Y-dnXhUvLmXExjvJIgQV8F2oDXhKtS1M'],
      success (res) {
        wx.showModal({
          cancelColor: 'cancelColor',
          title:'温馨提示',
          content:'请确认订阅次数加1',
          success(res){
            that.selectSubNum()
          }
        })
      },
      fail(res){
        console.log('授权失败',res)
      }
    })
  },
  //获取自己的订阅数
  getSubNum(){
    const db = wx.cloud.database()
    db.collection('subscribe_num').get({
      success:(res)=>{
        var sub = res.data[0]
        this.setData({
          num:sub.num
        })
      }
    })
  },

  //遍历数据库中的订阅消息并修改
  selectSubNum(){
    wx.showLoading({
      title: '加载中...',
    })
    const db = wx.cloud.database()
    db.collection('subscribe_num').get({
      success:(res)=>{
        var subNum = res.data[0]
        var id = subNum._id
        var num = subNum.num
        this.setData({
          num:num
        })
        var myDate = new Date()
        var currentTime = util.formatTime(myDate,'Y/M/D h:m:s')
        //调用云函数修改会员表
        wx.cloud.callFunction({
          name:'updateSubNum',
          data:{
            _id:id,
            num:num+1,
            updatetime:currentTime
          },
          success:res =>{
            wx.hideLoading({
              complete: (res) => {
              },
            })
          },
          fail:err =>{
            wx.showToast({
              icon:'none',
              title: '更新订阅消息数量失败',
              duration:2000
            })
          }
        })
      },
      fail:console.error
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSubNum()
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