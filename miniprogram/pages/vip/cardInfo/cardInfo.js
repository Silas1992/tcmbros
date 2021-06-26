// miniprogram/pages/vip/cardInfo/cardInfo.js
var util = require('../../../util/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo:{},
    member:{},
    balance:0
  },
  //查询当前用户是否已经有可使用的卡
  selectMycard:function(e){
    const db = wx.cloud.database()
    var that = this
    db.collection('my_card').where({
      status:1
    }).get({
      success:function(res){
        var myCard = res.data
        let len = myCard.length
        if(len === 0){
          that.goPay()
        }else{
          var _id = myCard[0]._id
          wx.showModal({
            title: '温馨提示',
            content:'请注销当前储值卡，再进行购买，注销后储值余额不变',
            success(res){
              if(res.confirm){
                wx.showModal({
                  title: '温馨提示',
                  content:'您确定要注销当前储值卡吗？',
                  success(res){
                    if(res.confirm){
                      that.updateMycard(_id)
                    }
                  }
                })
              }else if(res.cancel){

              }
            }
          })
        }
      },
      fail:function(err){
        console.log('查询失败')
      }
    })
  },
  //注销储值卡
  updateMycard:function(id){
    var that = this
    const db = wx.cloud.database()
    db.collection('my_card').doc(id).update({
      data:{
        status:2
      },
      success:function(res){
        wx.showToast({
          icon:'none',
          title: '注销成功,请再次购买储值卡',
          duration:2000
        })
      }
    })
  },
  //去支付
  goPay:function(evt){
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    var body = "安宁区洢万咖啡店"
    let money = this.data.cardInfo.money
    //这里生成自己的outTradeNo
    var outTradeNo = util.wxuuid(16,16)
    
    wx.cloud.callFunction({
      name:"pay",
      data:{
        body:body,
        outTradeNo:outTradeNo,
        money:money,//支付金额
        nonceStr:util.wxuuid(32,32)//调用自己的随机数生成规则
      },
      success(res){
        wx.hideLoading({
          complete: (res) => {
          },
        })
        //可以在这里创建自己的订单
        //这里修改用户订单中的outTradeNo
        //返回参数后调用支付拉起支付页面
        that.pay(res.result)
      },
      fail(res){
        wx.hideLoading({
          complete: (res) => {
          },
        })
        console.log("提交失败",res)
      }
    })
  },
  pay(payData){
    var that = this
    const payment = payData.payment
    wx.requestPayment({
      ...payment,
      success(res){
        //创建自己的会员卡
        that.creatMyCard()
      },
      fail(res){
        console.error('pay fail',res)
        //跳转到失败页面
      }
    })
  },
  //购买成功后将会员卡添加到自己的会员表中
  creatMyCard:function(){
    //2.初始化订单数据
    var myDate = new Date()
    let cardInfo = this.data.cardInfo
    const db = wx.cloud.database()
    db.collection('my_card').add({
      data:{
        value:cardInfo.value,
        money:cardInfo.money,
        card_no:cardInfo.card_no,
        imageUrl:cardInfo.imageUrl,
        name:cardInfo.name,
        status:1,
        remark:'',
        describle:cardInfo.describle,
        card_type:'',
        indate:0,
        start_time:myDate.toLocaleString(),
        end_time:cardInfo.end_time
      },
      success:res=>{
        //查询余额再进行修改余额
        this.selectBalance(cardInfo.value)
      },
      fail:err=>{
        wx.showToast({
          icon:'none',
          title: '购买失败',
          duration:2000
        })
      }
    })
  },
  //查询用户储值卡余额
  selectBalance:function(value){
    var that = this
    const db = wx.cloud.database()
    db.collection('member').get({
      success:function(res){
        var member = res.data[0]
        that.setData({
          balance:member.balance
        })
        let newValue = value-1+member.balance
        //充值完成后修改会员表中剩余的额度
        that.updataBalance(newValue)
        wx.showToast({
          icon:'none',
          title: '恭喜您已成功购买储值卡',
        })
      }
    })
  },

  updataBalance:function(balance){
    var id = this.data.member._id
    var myDate = new Date()
      //调用云函数修改会员表
    wx.cloud.callFunction({
      name:'updatemember',
      data:{
        _id:id,
        balance:balance,
        updatetime:myDate.toLocaleString()
      },
      success:res =>{
        wx.hideLoading({
          complete: (res) => {
          },
        })
        wx.navigateBack({
          delta:2,
          complete: (res) => {},
        })
      },
      fail:err =>{
        wx.showToast({
          icon:'none',
          title: '修改储值卡余额失败，请稍后再试',
          duration:2000
        })
      }
    })
  },

  //查询会员是否存在
  selectMember:function(){
    const db = wx.cloud.database()
    //表权限为默认权限，只有创建者openid可以读写
    db.collection('member').get({
      success:(res)=>{
        var member = res.data
        this.setData({
          member:member[0]
        })
      },
      fail:err=>{
        wx.showToast({
          icon:'none',
          title: '登录失败，请稍后再试',
          duration:2000
        })
      }
    })
  },
  
  showBuyModal () {
    // 显示遮罩层
    var animation = wx.createAnimation({
        duration: 400,
        /**
          * http://cubic-bezier.com/ 
          * linear 动画一直较为均匀
          * ease 从匀速到加速在到匀速
          * ease-in 缓慢到匀速
          * ease-in-out 从缓慢到匀速再到缓慢
          * 
          * http://www.tuicool.com/articles/neqMVr
          * step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
          * step-end 保持 0% 的样式直到动画持续时间结束 一闪而过
          */
        timingFunction: "ease",
        delay: 0
    })
    this.animation = animation
    animation.translateY(700).step()
    this.setData({
        animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
        showModalStatus: true
    })
    setTimeout(() => {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()  // export 方法每次调用后会清掉之前的动画操作。
        })
    }, 400)
  },

  // hideBuyModal () {
  //   // 隐藏遮罩层
  //   var animation = wx.createAnimation({
  //       duration: 200,
  //       timingFunction: "ease",
  //       delay: 0
  //   })
  //   this.animation = animation
  //   animation.translateY(300).step()
  //   this.setData({
  //       animationData: animation.export(),
  //   })
  //   setTimeout(function () {
  //       animation.translateY(0).step()
  //       this.setData({
  //           animationData: animation.export(),
  //           showModalStatus: false
  //       })
  //       console.log(this)
  //   }.bind(this), 200)
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cardId = options.id
    var that = this
    const db = wx.cloud.database()
    db.collection('card').doc(cardId).get({
      success:function(res){
        that.setData({
          cardInfo:res.data
        })
      }
    })
    this.showBuyModal()
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