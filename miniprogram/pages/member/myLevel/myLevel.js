// miniprogram/pages/member/myLevel/myLevel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    level:0,//等级0,1,2
    height:0,//将高度分为100份中的份数
    levelInfos:[]

  },

  _getHeight:function(){
    var points = 45 //获取该用户当前积分
    var that = this
    const db = wx.cloud.database()
    //获取积分登记表信息
    db.collection('member_level').get({
      success(res){
        that.setData({
          levelInfos:res.data
        })
        let levelInfos = that.data.levelInfos
        for(var i=0,len=levelInfos.length;i<len;i++){
          let consum_points = levelInfos[i].consum_points
          if(points>consum_points){
            
            that.setData({
              level:i+1
            })
            
          }
        }
        let level = that.data.level
        if(level === 0){
          //当为普通用户时
          that.setData({
            height:parseFloat(((points/1000)*100).toFixed(2))
          })
        }
        if(level === 1){
          //当为白银会员时
          that.setData({
            height:parseFloat((((points-1000)/5000)*100).toFixed(2))
          })
        }
        if(level === 2){    
          //当为黄金会员时
          that.setData({
            height:parseFloat((((points-5000)/10000)*100).toFixed(2))
          })
        }

      }
    }) 

    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that._getHeight()
    

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