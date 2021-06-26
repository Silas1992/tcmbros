// miniprogram/pages/member/pointsMall/pointsMall.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH:0,
    tabs:[
      {
        id:0,
        name:'消费记录',
        isActive:true
      }
    ],
    cardList:[],
    openid:'',
    manageid:'',
    cardBalance:0,
    myCard:{},
    haveCard:false,
    cardRecord:[],
    haveRecord:true
  },

  //自定义事件
  handleItemChange:function(e){
    const {index} = e.detail
    let {tabs} = this.data
    tabs.forEach((v,i) => i === index ?v.isActive = true : v.isActive = false)
    this.setData({tabs})
  },

  goback(){
    wx.navigateBack({delata:1})
  },

  _toCardInfo:function(evt){
    let id = evt.currentTarget.id
    wx.navigateTo({
      url: '../cardInfo/cardInfo?id='+id,
    })
  },
  toAdd:function(e){
    wx.navigateTo({
      url: '../addCard/addCard',
    })
  },

  //商品上架接口
  toPutStatus:function(e){
    let id = e.currentTarget.id
    var myDate = new Date()
    var that = this
    wx.cloud.callFunction({
      name:'updateCardStatus',
      data:{
        _id:id,
        status:1,
        updatatime:myDate.toLocaleString()
      },
      success:function(res){
        wx.showToast({
          title: '上架成功',
          duration:2000
        })
        //重新渲染页面
        that.onShow()

      },
      fail:console.error
    })

  },

  //商品下架接口
  toDownStatus:function(e){
    let id = e.currentTarget.id
    var myDate = new Date()
    var that = this
    wx.cloud.callFunction({
      name:'updateCardStatus',
      data:{
        _id:id,
        status:2,
        updatatime:myDate.toLocaleString()
      },
      success:function(res){
        wx.showToast({
          title: '下架成功',
          duration:2000
        })
        //重新渲染页面
        that.onShow()
      },
      fail:console.error
    })
  },

  delete:function(cardId){
    let id = cardId
    var that = this
    const db = wx.cloud.database()
    db.collection('card').doc(id).remove({
      success:function(res){
        wx.showToast({
          title: '删除成功',
          duration:2000
        })
        //重新渲染页面
        that.onShow()
      }
    })
  },
  //删除商品接口
  toDelete:function(e){
    let id = e.currentTarget.id
    var that = this
    wx.showModal({
      title:'温馨提示',
      content:'此操作将彻底删除会员卡，您确定要删除吗？',
      success(res){
        if(res.confirm){
          that.delete(id)
        }else if(res.cancel){

        }
      }
    })
    
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

  //遍历自己的储值卡
  getMyCard:function(e){
    var that = this
    var openid = this.data.openid
    var manageid = this.data.manageid
    const db = wx.cloud.database()
    if(openid != '' && openid == manageid){
      db.collection('card').get({
        success:function(res){
          if(res.data.length != 0){
            var myCard = res.data[0]
            that.setData({
              myCard:myCard
            })
            that.setData({
              haveCard:true
            })
          }
        }
      })
    }else{
      db.collection('card').where({
        status:1
      }).get({
        success:function(res){
          
          if(res.data.length != 0){
            var myCard = res.data[0]
            that.setData({
              myCard:myCard
            })
            that.setData({
              haveCard:true
            })
          }
        }
      })
    }
  },
  //云函数获取我的订单列表
  getCardRecord:function(e){
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    wx.cloud.callFunction({
      name:'getCardRecord',
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

  //获取当前超级管理员
  getUserid:function(){
    wx.cloud.callFunction({
      name:'getMember',
      data:{
        position:4
      },
      success:(res)=>{
        if(res.result.data.length !== 0){
          var openid = res.result.data[0]._openid
          console.log('当前的超级管理员是',res.result.data[0])
          this.setData({
            manageid:openid
          })
        }
      },
      fail:(err)=>{
        console.log('发生错误',err)
      }
    })
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取当前超级管理员
    this.getUserid()
    //检查是否登录
    this.selectMember()
    //遍历自己的储值卡
    this.getMyCard()
    //判断是否有记录，遍历自己的储值卡消费记录
    this.selectRecord()
    let cardBalance = options.cardBalance
    this.setData({
      cardBalance:cardBalance
    })
    //设置列表高度
    wx.getSystemInfo({
      complete: (res) => {
        this.data.navH = res.statusBarHeight + 440;
      },fail(err){
        console.log(err);
      }
    })
    let openid = app.globalData.openid
    this.setData({
      navH:this.data.navH,
      openid:openid
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
    //调取用户登录信息
    let openid = app.globalData.openid
    //遍历数据库渲染数据
    var that = this
    //获取数据库引用
    const db = wx.cloud.database()
    //获取集合的引用
    const card = db.collection('card')
    if(openid == 'oLPjn5f_Yd4xlmwh4xclUH0wk1y4'){
      card.get({
        success(res){
          that.setData({
            cardList:res.data
          })
        }
      })
    }else{
      //如果是用户则只展示已经上架的会员卡
      card.where({
        status:1
      }).get({
        success(res){
          that.setData({
            cardList:res.data
          })
        }
      })
    }
    
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