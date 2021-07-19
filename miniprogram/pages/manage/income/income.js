//index.js
//获取应用实例世界都去哪里了
const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 1,
    scrollLeft: 0,
    deductRecord:[],
    name:'',
    newRecord:[],
    selectedMonthRecord:[],
    currentMonth:0
  },
  regroup:function(deductRecord){
    let newRecord = [];
    deductRecord.forEach((item,i)=>{
      let index = -1
      let sindex = -1
      let mindex = -1
      let isExists = newRecord.some((newItem,j)=>{
        mindex = j
        if(item.year == newItem.year && item.month == newItem.month){
          index = j;
          let sisExists = newItem.subList.some((newsItem,z)=>{
            if(item.date == newsItem.date){
              sindex = z;
              return true
            }
          })
          if(!sisExists){
            newItem.subList.push({
              date:item.date,
              date_total:Number(item.de_money),
              subsList:[item]
            })
          }else{
            newRecord[index].subList[sindex].subsList.push(item)
            newRecord[index].subList[sindex].date_total = newRecord[index].subList[sindex].date_total + Number(item.de_money)
          }
          return true;
        }
      })

      if(!isExists){
        newRecord.push({
          year:item.year,
          month:item.month,
          total:Number(item.de_money),
          subList:[]
        })
        newRecord[mindex+1].subList.push({
          date:item.date,
          date_total:Number(item.de_money),
          subsList:[item]
        })
      }else{
        //newRecord[index].subList.push(item)
        newRecord[index].total = newRecord[index].total + Number(item.de_money)
      }
    })

    this.setData({
      newRecord:newRecord
    })
    console.log('此时的消费记录为',newRecord)
  },
  //先判断有没有消费记录
  selectRecord:function(e){
    var that = this
    wx.cloud.callFunction({
      name:'getDeductRecord',
      data:{
        name:that.data.name
      },
      success:function(res){
        let deductRecord = res.result.data
        console.log('哈哈哈',deductRecord)
        if(deductRecord.length !== 0){
          that.setData({
            deductRecord:deductRecord
          })
          //调用重组数据结构的接口
          that.regroup(deductRecord)
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

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showModal(e) {
    let i = e.currentTarget.dataset.i
    if(i !== undefined){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
      console.log('当前的i',i)
      //根据点击的索引来获取当前月的数组并赋值
      let newRecord = this.data.newRecord
      this.setData({
        selectedMonthRecord:newRecord[i].subList,
        currentMonth:newRecord[i].month
      })
    }else{
      console.log('输入有误')
    }
    
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      selectedMonthRecord:[],
      currentMonth:0
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
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
    
  }
})
