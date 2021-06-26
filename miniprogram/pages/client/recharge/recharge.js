// miniprogram/pages/member/pointsMall/pointsMall.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardRecord:[],
    haveRecord:true
  },


  goback(){
    wx.navigateBack({delata:1})
  },

  
  //查询会员是否存在
  selectMember:function(){
    //获取用户的详情
    wx.cloud.callFunction({
      name:'getMemberInfo',
      complete:res=>{
        if(res.result !== undefined){
          let member =  res.result.data
          let len = member.length
          if(len === 0){
            wx.navigateBack({
              delta:1,
              complete: (res) => {
                wx.showToast({
                  icon:'none',
                  title: '请您点击头像进行登录！',
                  duration:5000
                })
              },
            })
          }
        }
      }
    })
  },


  //云函数获取我的订单列表
  getCardRecord:function(e){
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    wx.cloud.callFunction({
      name:'getCardRecord',
      data:{
        state:2
      },
      success:function(res){
        let cardRecord = res.result.data
        that.setData({
          cardRecord:cardRecord
        })
        wx.hideLoading({
          complete: (res) => {},
        })
      },
      fail:console.error
    })
  },
  //先判断有没有消费记录
  selectRecord:function(e){
    var that = this
    wx.cloud.callFunction({
      name:'getCardRecord',
      success:function(res){
        let cardRecord = res.result.data
        console.log('此时的消费记录为',cardRecord)
        if(cardRecord.length != 0){
          //遍历自己的储值卡消费记录
          that.getCardRecord()
        }else{
          that.setData({
            haveRecord:false
          })
        }
      }    
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //检查是否登录
    this.selectMember()
    //判断是否有记录，遍历自己的储值卡消费记录
    this.selectRecord()
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
    //调取用户登录信息
    //遍历数据库渲染数据
    
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