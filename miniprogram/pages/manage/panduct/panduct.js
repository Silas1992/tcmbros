// miniprogram/pages/manage/panduct/panduct.js
var TIME = require('../../../util/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSelectValue:'当日',
    isShow:false,
    selected:1,
    incomeDate:0,//总收入
    productIn:0,//产品收入
    CardIn:0,//办卡收入
    freeIn:0,//散客收入
    couponIn:0,//按次服务收入
    insertNum:0,//新增会员数
    startDate:0,//s开始年月日
    endDate:0,//结束年月日
    tabs: [],
    activeTab: 0,
    selectedIn:1,
    // 月份选择模态
    showDialog: false,
    showDateDialog:false,
    showMonthDialog:false,
    showYearDialog:false,
    groupMonth:[
      {value:1},{value:2},{value:3},{value:4},{value:5},{value:6},
      {value:7},{value:8},{value:9},{value:10},{value:11},{value:12},
    ],
    groupYear:[
      {value:2021},{value:2022},{value:2023},{value:2024},{value:2025},
      {value:2026},{value:2027},{value:2028},{value:2029},{value:2030},
    ],
    groupDate:[],
    groups: [
      { 
        year:2021,
        months: [
          { text: '7月', value: 7 },
          { text: '8月', value: 8 },
          { text: '9月', value: 9 },
          { text: '10月', value: 10 },
          { text: '11月', type: 'warn', value: 11 }
        ]
      },
      { 
        year:2020,
        months:[
          { text: '9月', value: 9 },
          { text: '10月', value: 10 },
          { text: '11月', value: 11 }
        ]
      },
      { 
        year:2019,
        months:[
          { text: '9月', value: 9 },
          { text: '10月', value: 10 },
          { text: '11月', value: 11 }
        ]
      }
        
    ],

    haveRecord:false,//是否有记录
    record:[],//记录集合
    newRecord:[],//转换后的集合
    employees:[],//本店员工集合
    selectedName:'',//选择的会员
  },
  //将记录转化成年月日的格式
  updage:function(){
      var cardRecord = this.data.record
      console.log(cardRecord)
      let newRecord = [];
      cardRecord.forEach((item,i)=>{
        let index = -1
        let isExists = newRecord.some((newItem,j)=>{
          if(item.year == newItem.year && item.month == newItem.month){
            index = j;
            return true;
          }
        })

        if(!isExists){
          newRecord.push({
            year:item.year,
            month:item.month,
            subList:[item]
          })
        }else{
          newRecord[index].subList.push(item)
        }
      })
      this.setData({
        newRecord:newRecord
      })
      console.log('没有啊',newRecord)
  },
  //遍历会员办理记录和散客收入记录
  selectRecRecord:function(e){
    var that = this
    let state = 1
    
    let selectedIn = this.data.selectedIn
    console.log('哈哈哈',selectedIn)
    if(selectedIn == 1){
      state = 2
    }else{
      state = 1
    }
    wx.cloud.callFunction({
      name:'getBuyRecord',
      data:{
       state:state
      },
      success:function(res){
        let record = res.result.data
        console.log('获取的会员办理和散客收入记录为',record)
        if(record.length !== 0){
          console.log('进来了')
          that.setData({
            record:record
          })
          that.updage()
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
  //遍历本店的员工
  selectEmployee:function(e){
    var that = this
    wx.cloud.callFunction({
      name:'getMember',
      data:{
       position:3
      },
      success:function(res){
        let employees = res.result.data
        console.log('当前的员工集合为',employees)
        if(employees.length !== 0){
          that.setData({
            employees:employees
          })
        }
      },
      fail:err=>{

      }    
    })
  },
  //tab切换
  onTabClick(e) {
    const index = e.detail.index
    this.setData({ 
      activeTab: index,
      selectedIn:1,
      selectedName:''
    })
  },
  //切换大菜单
  onChange(e) {
    const index = e.detail.index
    this.setData({ 
      activeTab: index,
      selectedIn:1,
      selectedName:''
    })
  },
  //选择小按钮
  selectBtn(e){
    let id = e.currentTarget.dataset.id
    if(id!== undefined){
      this.setData({
        selectedIn:id
      }) 
    }
    let name = e.currentTarget.dataset.name
    if(name !== undefined){
      this.setData({
        selectedName:name
      })
    }
    console.log('来了来了')
    this.selectRecRecord() 
  },
  // 打开选择
  openDialog: function () {
      this.setData({
          showDialog: true
      })
      console.log('来了来了')
  },
  //打开年选择
  openYearDialog: function () {
    this.setData({
        showYearDialog: true
    })
  },
  //打开月选择
  openMonthDialog: function () {
    this.setData({
        showMonthDialog: true
    })
  },
  //打开日选择
  openDateDialog: function () {
    this.setData({
        showDateDialog: true
    })
  },

  closeDialog: function () {
      this.setData({
          showDialog: false
      })
  },
  btnClick(e) {
      console.log(e)
      this.closeDialog()
  },

  handleSelect(){
    let isShow = this.data.isShow
    this.setData({
      isShow:!isShow
    })
  },
  //数据统计自定义时间区间，开始时间
  bindStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value.replace(/-/g,'-')//利用正则替换
    })
    //判断两个时间有没有都选择，并且结束时间大于开始时间
    let endDate = this.data.endDate
    if(endDate != 0){
      if(endDate>=this.data.startDate){
        this.resetData()
      }else{
        wx.showToast({
          icon:"none",
          title: '日期区间有误，请重新选择日期！',
        })
      }
    }
  },
  //数据统计时间区间结束时间
  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value.replace(/-/g,'-')
    })
    //判断两个时间有没有都选择，并且结束时间大于开始时间
    let startDate = this.data.startDate
    console.log('当前的时间',startDate, e.detail.value.replace(/-/g,'-'))
    if(startDate != 0){
      if(this.data.endDate>=startDate){
        this.resetData()
      }else{
        wx.showToast({
          icon:"none",
          title: '日期区间有误，请重新选择日期！',
        })
      }
    }
  },
  //重置总览统计数据，然后根据新条件，遍历统计数据
  resetData(){
    this.setData({
      incomeDate:0,//总收入
      productIn:0,//产品收入
      CardIn:0,//办卡收入
      freeIn:0,//散客收入
      couponIn:0,//按次服务收入
      insertNum:0,//新增会员数
    })
    
    this.getTotalIncome()
    this.getInsertNum()
    this.getCouponIn()
    this.getFreeIn()
    this.getCardIn()
    this.getProductIn()
  },
  //数据统计选择按天统计
  selectToday(){
    
    this.setData({
      selected:1,
      currentSelectValue:'当日',
      isShow:false
    })
    this.resetData()
  },
  //选择按7天统计
  selectSeven(){
    
    this.setData({
      selected:2,
      currentSelectValue:'近7天',
      isShow:false
    })
    this.resetData()
  },
  //选择按近30天统计
  selectThirty(){
    this.setData({
      selected:3,
      currentSelectValue:'近30天',
      isShow:false
    })
    this.resetData()
  },
  //选择自定义统计
  selectCustom(){
    this.setData({
      selected:4,
      isShow:false
    })
  },
  //获取统计数据
  getTotalIncome(){
    var selected = this.data.selected
    var myDate = new Date()
    var currentTime = "00"
    var today = TIME.formatDate(new Date())+" 23:59:59"
    var sevenTime = "00"
    var thirtyTime = "00"
    var startTime = "00"
    var endTime = "00"
    if(selected == 1){//默认selected为1,遍历当天数据
      currentTime = TIME.formatTimeToday(myDate)
    }else if(selected == 2){//当selected为2，遍历近一周的数据
      //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
      var seventime=(new Date).getTime()-24*60*60*1000*6;
      sevenTime = TIME.formatDate(new Date(seventime))+" 00:00:00"
    }else if(selected == 3){//当selected为3，遍历近一个月的数据
      var thirtytime=(new Date).getTime()-24*60*60*1000*29;
      thirtyTime = TIME.formatDate(new Date(thirtytime))+" 00:00:00"
    }else{//当selected为4或者其他值的时候遍历自定义日期区间的数据
      startTime = this.data.startDate+" 00:00:00"
      endTime = this.data.endDate+" 23:59:59"
    }
    var that = this
    wx.cloud.callFunction({
      name:'getIncome',
      data:{
        selected:selected,
        create_time:currentTime,
        today:today,
        sevenTime:sevenTime,
        thirtyTime:thirtyTime,
        goods_type:1,
        startTime:startTime,
        endTime:endTime,
      },
      success:function(res){
        if(res.result.length>0){
          var incomeDate = res.result[0].totalNum
          that.setData({
            incomeDate:incomeDate
          })
        }
        wx.hideLoading({
          complete: (rs) => {
          },
        })
      },
      fail:err=>{
        wx.hideLoading({
          complete: (err) => {
          },
        })
        console.log("提交失败",err)
      }
    })
    
  },
  //获取实体商品收入
  getProductIn(){
    var selected = this.data.selected
    var myDate = new Date()
    var currentTime = "00"
    var today = TIME.formatDate(new Date())+" 23:59:59"
    var sevenTime = "00"
    var thirtyTime = "00"
    var startTime = "00"
    var endTime = "00"
    if(selected == 1){//默认selected为1,遍历当天数据
      currentTime = TIME.formatTimeToday(myDate)
    }else if(selected == 2){//当selected为2，遍历近一周的数据
      //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
      var seventime=(new Date).getTime()-24*60*60*1000*6;
      sevenTime = TIME.formatDate(new Date(seventime))+" 00:00:00"
    }else if(selected == 3){//当selected为3，遍历近一个月的数据
      var thirtytime=(new Date).getTime()-24*60*60*1000*29;
      thirtyTime = TIME.formatDate(new Date(thirtytime))+" 00:00:00"
    }else{//当selected为4或者其他值的时候遍历自定义日期区间的数据
      startTime = this.data.startDate+" 00:00:00"
      endTime = this.data.endDate+" 23:59:59"
    }
    var that = this
    wx.cloud.callFunction({
      name:'getFreeIn',
      data:{
        selected:selected,
        create_time:currentTime,
        today:today,
        sevenTime:sevenTime,
        thirtyTime:thirtyTime,
        type:3,
        startTime:startTime,
        endTime:endTime,
      },
      success:function(res){
        if(res.result.length>0){
          let productIn = res.result[0].totalNum
          that.setData({
            productIn:productIn
          })
        }
        wx.hideLoading({
          complete: (rs) => {
          },
        })
      },
      fail:err=>{
        wx.hideLoading({
          complete: (err) => {
          },
        })
        console.log("提交失败",err)
      }
    })
  },
  //获取办卡收入
  getCardIn(){
    var selected = this.data.selected
    var myDate = new Date()
    var currentTime = "00"
    var today = TIME.formatDate(new Date())+" 23:59:59"
    var sevenTime = "00"
    var thirtyTime = "00"
    var startTime = "00"
    var endTime = "00"
    if(selected == 1){//默认selected为1,遍历当天数据
      currentTime = TIME.formatTimeToday(myDate)
    }else if(selected == 2){//当selected为2，遍历近一周的数据
      //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
      var seventime=(new Date).getTime()-24*60*60*1000*6;
      sevenTime = TIME.formatDate(new Date(seventime))+" 00:00:00"
    }else if(selected == 3){//当selected为3，遍历近一个月的数据
      var thirtytime=(new Date).getTime()-24*60*60*1000*29;
      thirtyTime = TIME.formatDate(new Date(thirtytime))+" 00:00:00"
    }else{//当selected为4或者其他值的时候遍历自定义日期区间的数据
      startTime = this.data.startDate+" 00:00:00"
      endTime = this.data.endDate+" 23:59:59"
    }
    var that = this
    wx.cloud.callFunction({
      name:'getFreeIn',
      data:{
        selected:selected,
        create_time:currentTime,
        today:today,
        sevenTime:sevenTime,
        thirtyTime:thirtyTime,
        type:2,
        startTime:startTime,
        endTime:endTime,
      },
      success:function(res){
        if(res.result.length>0){
          let CardIn = res.result[0].totalNum
          that.setData({
            CardIn:CardIn
          })
        }
        wx.hideLoading({
          complete: (rs) => {
          },
        })
      },
      fail:err=>{
        wx.hideLoading({
          complete: (err) => {
          },
        })
        console.log("提交失败",err)
      }
    })
  },
  //获取办卡收入
  getFreeIn(){
    var selected = this.data.selected
    var myDate = new Date()
    var currentTime = "00"
    var today = TIME.formatDate(new Date())+" 23:59:59"
    var sevenTime = "00"
    var thirtyTime = "00"
    var startTime = "00"
    var endTime = "00"
    if(selected == 1){//默认selected为1,遍历当天数据
      currentTime = TIME.formatTimeToday(myDate)
    }else if(selected == 2){//当selected为2，遍历近一周的数据
      //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
      var seventime=(new Date).getTime()-24*60*60*1000*6;
      sevenTime = TIME.formatDate(new Date(seventime))+" 00:00:00"
    }else if(selected == 3){//当selected为3，遍历近一个月的数据
      var thirtytime=(new Date).getTime()-24*60*60*1000*29;
      thirtyTime = TIME.formatDate(new Date(thirtytime))+" 00:00:00"
    }else{//当selected为4或者其他值的时候遍历自定义日期区间的数据
      startTime = this.data.startDate+" 00:00:00"
      endTime = this.data.endDate+" 23:59:59"
    }
    var that = this
    wx.cloud.callFunction({
      name:'getFreeIn',
      data:{
        selected:selected,
        create_time:currentTime,
        today:today,
        sevenTime:sevenTime,
        thirtyTime:thirtyTime,
        type:1,
        startTime:startTime,
        endTime:endTime,
      },
      success:function(res){
        if(res.result.length>0){
          let freeIn = res.result[0].totalNum
          that.setData({
            freeIn:freeIn
          })
        }
        wx.hideLoading({
          complete: (rs) => {
          },
        })
      },
      fail:err=>{
        wx.hideLoading({
          complete: (err) => {
          },
        })
        console.log("提交失败",err)
      }
    })
  },
  //获取按次消费券收入
  getCouponIn(){
    var selected = this.data.selected
    var myDate = new Date()
    var currentTime = "00"
    var today = TIME.formatDate(new Date())+" 23:59:59"
    var sevenTime = "00"
    var thirtyTime = "00"
    var startTime = "00"
    var endTime = "00"
    if(selected == 1){//默认selected为1,遍历当天数据
      currentTime = TIME.formatTimeToday(myDate)
    }else if(selected == 2){//当selected为2，遍历近一周的数据
      //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
      var seventime=(new Date).getTime()-24*60*60*1000*6;
      sevenTime = TIME.formatDate(new Date(seventime))+" 00:00:00"
    }else if(selected == 3){//当selected为3，遍历近一个月的数据
      var thirtytime=(new Date).getTime()-24*60*60*1000*29;
      thirtyTime = TIME.formatDate(new Date(thirtytime))+" 00:00:00"
    }else{//当selected为4或者其他值的时候遍历自定义日期区间的数据
      startTime = this.data.startDate+" 00:00:00"
      endTime = this.data.endDate+" 23:59:59"
    }
    var that = this
    wx.cloud.callFunction({
      name:'getFreeIn',
      data:{
        selected:selected,
        create_time:currentTime,
        today:today,
        sevenTime:sevenTime,
        thirtyTime:thirtyTime,
        type:4,
        startTime:startTime,
        endTime:endTime,
      },
      success:function(res){
        console.log('获取消费券数据',res.result.length)
        if(res.result.length>0){
          let couponIn = res.result[0].totalNum
          that.setData({
            couponIn:couponIn
          })
        }
        wx.hideLoading({
          complete: (rs) => {
          },
        })
      },
      fail:err=>{
        wx.hideLoading({
          complete: (err) => {
          },
        })
        console.log("提交失败",err)
      }
    })
  },
  //获取统计数据
  getInsertNum(){
    var selected = this.data.selected
    var myDate = new Date()
    var currentTime = "00"
    var today = TIME.formatDate02(new Date())+" 23:59:59"
    var sevenTime = "00"
    var thirtyTime = "00"
    var startTime = "00"
    var endTime = "00"
    if(selected == 1){//默认selected为1,遍历当天数据
      currentTime = TIME.formatTimeToday02(myDate)
    }else if(selected == 2){//当selected为2，遍历近一周的数据
      //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
      var seventime=(new Date).getTime()-24*60*60*1000*6;
      sevenTime = TIME.formatDate02(new Date(seventime))+" 00:00:00"
    }else if(selected == 3){//当selected为3，遍历近一个月的数据
      var thirtytime=(new Date).getTime()-24*60*60*1000*29;
      thirtyTime = TIME.formatDate02(new Date(thirtytime))+" 00:00:00"
    }else{//当selected为4或者其他值的时候遍历自定义日期区间的数据
      let sta1 = this.data.startDate
      let end = this.data.endDate
      let sta2 = sta1.replace(/-/g,'/')
      let end2 = end.replace(/-/g,'/')
      startTime = sta2+" 00:00:00"
      endTime = end2+" 23:59:59"
    }
    var that = this
    wx.cloud.callFunction({
      name:'getSmemNum',
      data:{
        selected:selected,
        create_time:currentTime,
        today:today,
        sevenTime:sevenTime,
        thirtyTime:thirtyTime,
        startTime:startTime,
        endTime:endTime
      },
      success:function(res){
        if(res.result.length>0){
          let insertNum = res.result[0].insertNum
          that.setData({
            insertNum:insertNum
          })
        }
        wx.hideLoading({
          complete: (rs) => {
          },
        })
      },
      fail:err=>{
        wx.hideLoading({
          complete: (err) => {
          },
        })
        console.log("提交失败",err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTotalIncome()
    this.getInsertNum()
    this.getCouponIn()
    this.getFreeIn()
    this.getCardIn()
    this.getProductIn()

    //遍历收入明细
    this.selectRecRecord()
    this.selectEmployee()
    const tabs = [
      {
        title: '收入明细',
        title2: '小程序开发进阶',
        img: 'http://mmbiz.qpic.cn/sz_mmbiz_jpg/GEWVeJPFkSEV5QjxLDJaL6ibHLSZ02TIcve0ocPXrdTVqGGbqAmh5Mw9V7504dlEiatSvnyibibHCrVQO2GEYsJicPA/0?wx_fmt=jpeg',
        desc: '本视频系列课程，由腾讯课堂NEXT学院与微信团队联合出品，通过实战案例，深入浅出地进行讲解。',
      },
      {
        title: '工资支出',
        title2: '常见问题和解决方案',
        img: 'http://mmbiz.qpic.cn/sz_mmbiz_jpg/GEWVeJPFkSGqys4ibO2a8L9nnIgH0ibjNXfbicNbZQQYfxxUpmicQglAEYQ2btVXjOhY9gRtSTCxKvAlKFek7sRUFA/0?wx_fmt=jpeg',
        desc: '提高审核质量',
      },
    ]
    this.setData({ tabs })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      container: () => wx.createSelectorQuery().select('#container')
    })
  },
  onScroll(e) {
    console.log('onScroll', e)
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