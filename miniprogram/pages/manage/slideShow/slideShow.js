// miniprogram/pages/manage/slideShow/slideShow.js
var util = require('../../../util/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:{},
    banner_one:'',
    banner_two:'',
    banner_three:''
  },

  selectBanner:function(evt){
    const db = wx.cloud.database()
    db.collection('banner').get({
      success:(res)=>{
        var banner = res.data[0]
        console.log('哈哈哈',banner)
        this.setData({
          banner:banner
        })
      },
      fail:console.error
    })
  },


  //上传照片
  doUpload: function (e) {
    let id = e.currentTarget.id
    console.log(e)
    // 选择图片
    var that = this
    var imageName = util.wxuuid(8,8)
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      
      success: function(res){
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        console.log(filePath)
        // 上传图片
        const cloudPath = 'banner/'+imageName+ filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            console.log(id)
            if(id == '1'){
              that.setData({
                ['banner.banner_one']:res.fileID
              })
              that.updateBanner(res.fileID,id)
            }else if(id == '2'){
              that.setData({
                ['banner.banner_two']:res.fileID
              })
              that.updateBanner(res.fileID,id)
            }else{
              that.setData({
                ['banner.banner_three']:res.fileID
              })
              that.updateBanner(res.fileID,id)
            }
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  //修改banner表
  updateBanner(imageUrl,id){
    const db = wx.cloud.database()
    let _id = this.data.banner._id;
    if(id == '1'){
      db.collection('banner').doc(_id).update({
        data:{
          banner_one:imageUrl
        },
        success:(res)=>{
          console.log('修改成功1')
        }
      })
    }else if(id == '2'){
      db.collection('banner').doc(_id).update({
        data:{
          banner_two:imageUrl
        },
        success:(res)=>{
          console.log('修改成功2')
        },
        fail:console.error
      })
    }else{
      db.collection('banner').doc(_id).update({
        data:{
          banner_three:imageUrl
        },
        success:(res)=>{
          console.log('修改成功3')
        },
        fail:console.error
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectBanner()

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