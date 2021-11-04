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
    console.log(money,this.data.name,picker[index],note)

    if(parseInt(index)==1){
      //获取该员工的提成记录
      var that = this
      wx.cloud.callFunction({
        name:'getDeductRecord',
        data:{
          name:that.data.name,
          state:1
        },
        success:function(res){
          let deductRecord = res.result.data[0]
          let createTime = deductRecord.create_time
          console.log('此员工的最新提成记录为',deductRecord.create_time)
          //获取当前时间
          //获取当前的时间
          var date = new Date()
          let year = date.getFullYear()
          let month = date.getMonth()+1
          let m =month<10?('0'+month):month
          let day = date.getDate()
          let d = day<10?('0'+day):day
          
          let h = date.getHours()
          h = h<10 ?('0'+h):h
          let minute = date.getMinutes()
          minute = minute<10?('0' + minute):minute
          let second = date.getSeconds()
          second = second<10?('0'+second):second
          let currentTime = year+'-'+m+'-'+d+' '+h+':'+minute+':'+second

          let compareTime = year+'-'+m+'-'+d+' '+20+':'+30+':'+second
          //如果当前时间大于20:30，且提成时间也大于20:30，才可以计算提成否则不符合申请条件
          if((currentTime>compareTime) && (createTime>compareTime)){
            wx.cloud.callFunction({
              name:"addSubsidies",
              data:{
                name:that.data.name,
                type:picker[index],
                money:money,
                note:note,
                sub_id:that.data.member.sub_id
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
          }else{
            that.setData(
              { popErrorMsg: "加班补贴要在8:30之后，且8:30之后有提成才能申请" }
            ); 
          }
          
        },
        fail:err=>{
          wx.showToast({
            title: '获取员工提成失败',
          })
        }    
      })
      wx.hideLoading({
        success: (res) => {},
      }) 
      return;
    }else{
      wx.cloud.callFunction({
        name:"addSubsidies",
        data:{
          name:this.data.name,
          type:picker[index],
          money:money,
          note:note,
          sub_id:this.data.member.sub_id
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
    }
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