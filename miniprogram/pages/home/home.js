// miniprogram/pages/home/home.js
var util = require('../../util/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:{}
  },
  toLogin:function(){
    wx.navigateTo({
      url: '../person/personInfo/personInfo',
    })
  },
  toappointment:function(evt){
    wx.showModal({
      title:'温馨提示',
      content:'理疗预约功能火速建立中，请您持续关注'
    })
  },
  _toAccounts:function(evt){
    wx.showModal({
      title:'温馨提示',
      content:'公众号正在火速建立中，请您持续关注'
    })
  },

  selectBanner:function(evt){
    const db = wx.cloud.database()
    db.collection('banner').get({
      success:(res)=>{
        var banner = res.data[0]
        this.setData({
          banner:banner
        })
      },
      fail:console.error
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.cloud.callFunction({
      name:'login',
      complete:res => {
        app.globalData.openid = res.result.openid
      }
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
    //初始化banner
    this.selectBanner()
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