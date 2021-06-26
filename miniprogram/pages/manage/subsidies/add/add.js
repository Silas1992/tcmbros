const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    money:0,
    index: null,
    picker: ['两餐补贴', '加班补贴', '特殊奖金'],
    textareaBValue: '',
    popErrorMsg:'',
    member:{},
    name:''
  },
  formSubmit(e){
    wx.showLoading({
      title: '加载中',
    })
    //1.检查信息是否填满
    let index = this.data.index
    let picker = this.data.picker
    let note = this.data.textareaBValue
    let money = 0
    if(e.detail.value.money !== ''){
      money = parseInt(e.detail.value.money)
    }
    console.log(money,picker[index],note)
    if(money==0||index==null||note==''){
      this.setData(
        { popErrorMsg: "请将信息填写完整再提交" }
      ); 
      this.ohShitfadeOut();
      wx.hideLoading({
        success: (res) => {},
      }) 
      return;  
    }

    wx.cloud.callFunction({
      name:"addSubsidies",
      data:{
        name:this.data.name,
        type:picker[index],
        money:money,
        note:note
      },
      complete:res =>{
        //授权成功后，修改会员表中的字段为是管理员
        wx.hideLoading({
          success: (res) => {
            //返回上一级
            wx.navigateBack({delata:1})
          },
        })
      }
    })

  },
  //查询会员是否存在
  selectMember:function(){
    wx.showLoading({
      title: '加载中...',
    })
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
              name:member[0].name
            })
            wx.hideLoading({
              success: (res) => {
              },
            })
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
  //定时器提示框3秒消失
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  },
  PickerChange(e) {
    
    this.setData({
      index: e.detail.value
    })
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  }
})