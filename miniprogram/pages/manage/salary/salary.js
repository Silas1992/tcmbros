// miniprogram/pages/manage/salary/salary.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardRecord:[],
    haveRecord:true,
    name:''
  },

  
  //先判断有没有消费记录
  selectRecord:function(e){
    var that = this
    wx.cloud.callFunction({
      name:'getDeductRecord',
      data:{
        name:that.data.name,
        type:1
      },
      success:function(res){
        let cardRecord = res.result.data
        if(cardRecord.length !== 0){
          that.setData({
            cardRecord:cardRecord
          })
          //遍历自己的储值卡消费记录
          //that.getDeductRecord()
        }else{
          that.setData({
            haveRecord:false
          })
        }
      },
      fail:err=>{
        that.setData({
          haveRecord:false
        })
      }    
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:'getMemberInfo',
      complete:res => {
        let name = res.result.data[0].name
        console.log(name)
        this.setData({
          name:name
        })
        //判断是否有记录，遍历自己的储值卡消费记录
        this.selectRecord()
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