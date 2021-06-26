// miniprogram/pages/member/pointsMall/pointsMall.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH:0,

  },
  goback(){
    wx.navigateBack({delata:1})
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置列表高度
    wx.getSystemInfo({
      complete: (res) => {
        this.data.navH = res.statusBarHeight + 420;
      },fail(err){
        console.log(err);
      }
    })
    this.setData({
      navH:this.data.navH
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