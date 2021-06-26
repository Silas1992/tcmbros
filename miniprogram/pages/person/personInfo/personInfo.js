// miniprogram/pages/person/personInfo/personInfo.js
var time = require('../../../util/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member:{},
    phone:'',
    name:'',
    isHave:true
  },

  bindKeyInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //查询验重复并执行修改
  updateMemberName:function(id,currentTime){
    var that = this
    //在修改之前首先进行查询，看有没有相同姓名的人存在
    wx.cloud.callFunction({
      name:'getMember',
      data:{
        name:that.data.name
      },
      success:res=>{
        console.log('遍历之后的会员',res.result)
        let data = res.result.data
        if(data.length === 0){
          //进行修改操作
          //调用云函数修改会员表
          wx.cloud.callFunction({
            name:'updatemember',
            data:{
              _id:id,
              name:that.data.name,
              updatetime:currentTime
            },
            success:res =>{
              wx.showToast({
                icon:'none',
                title: '更新姓名成功',
                duration:2000
              })
              wx.hideLoading({
                complete: (res) => {
                    that.setData({
                      isHave:false
                    })
                },
              })
            },
            fail:err =>{
              wx.showToast({
                icon:'none',
                title: '更新姓名失败，请稍后再试',
                duration:2000
              })
            }
          })
        }
        else{
          wx.showToast({
            title: '你输入的姓名已经存在，请重新输入',
            icon:'none',
            duration: 2000
          })
          return;
        }
      }
    })
  },
  updateName:function(e){
    var id = this.data.member._id
    var myDate = new Date()
    var that = this
    var currentTime = time.formatTime(myDate,'Y/M/D h:m:s')
    // 获取用户信息
    wx.showModal({
      title: '温馨提示',
      content: '姓名只有一次提交机会，务必填写正确，否则请取消',
      success(res) {
        if (res.confirm) {
          //调用云函数
          that.updateMemberName(id,currentTime)
        } else if (res.cancel) {
          //拒绝授权 showErrorModal是自定义的提示
          wx.showToast({
            title: '您已取消,请重新输入正确姓名',
            icon:'none',
            duration: 2000
          })
          return;
        }
      }
    })
    
  },
  getPhoneNumber:function(e){
    wx.showLoading({
      title: '加载中...',
    })
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') { //用户点击拒绝
      wx.hideLoading({
        complete: (res) => {
        },
      })
      return
    }
    const that = this
    wx.cloud.callFunction({
      name:'getPhone',
      data:{
        weRunData:wx.cloud.CloudID(e.detail.cloudID)
      }
    }).then(res => {
      that.setData({
        phone:res.result.phone
      })
      var id = this.data.member._id
      var phone = res.result.phone
      var myDate = new Date()
      var currentTime = time.formatTime(myDate,'Y/M/D h:m:s')
      console.log(id,phone,currentTime)
       //调用云函数修改会员表
      wx.cloud.callFunction({
        name:'updatemember',
        data:{
          _id:id,
          tel:phone,
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
            title: '更新电话失败，请稍后再试',
            duration:2000
          })
        }
      })

      
    }).catch(err =>{
      console.error(err)
    })
  },
  //查询会员是否存在
  selectMember:function(){

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
              phone:member[0].tel,
              name:member[0].name
            })
            if(member[0].name !== ''){
              this.setData({
                isHave:false
              })
            }
          }
        }
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用遍历用户信息的方法
    this.selectMember()
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