var util = require('../../../util/util.js');
Page({
  data: {
      showTopTips: false,
      putawaycheck:false,

      radioItems: [
          {name: 'cell standard', value: '0'},
          {name: 'cell standard', value: '1', checked: true}
      ],
      checkboxItems: [
          {name: 'standard is dealt for u.', value: '0', checked: true},
          {name: 'standard is dealicient for u.', value: '1'}
      ],

      date: "2020-09-01",
      time: "12:01",

      countryCodes: ["+86", "+80", "+84", "+87"],
      countryCodeIndex: 0,

      values: ["200", "300", "400","500", "600","800", "1000"],
      valueIndex: 0,

      money: ["200", "300", "400","500", "600","800" ,"1000"],
      moneyIndex: 0,

      putawayStatus:2,//是否上架（默认不上架）
      imgUrl:'',//上传图片的地址
      imageUrl:'',
      popErrorMsg:'',
      cardId:'',


      isAgree: false
  },
  showTopTips: function(){
      var that = this;
      this.setData({
          showTopTips: true
      });
      setTimeout(function(){
          that.setData({
              showTopTips: false
          });
      }, 3000);
  },
  radioChange: function (e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value);

      var radioItems = this.data.radioItems;
      for (var i = 0, len = radioItems.length; i < len; ++i) {
          radioItems[i].checked = radioItems[i].value == e.detail.value;
      }

      this.setData({
          radioItems: radioItems
      });
  },
  checkboxChange: function (e) {
      console.log('checkbox发生change事件，携带value值为：', e.detail.value);

      var checkboxItems = this.data.checkboxItems, values = e.detail.value;
      for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
          checkboxItems[i].checked = false;

          for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
              if(checkboxItems[i].value == values[j]){
                  checkboxItems[i].checked = true;
                  break;
              }
          }
      }

      this.setData({
          checkboxItems: checkboxItems
      });
  },
  bindDateChange: function (e) {
      this.setData({
          date: e.detail.value
      })
  },
  bindTimeChange: function (e) {
      this.setData({
          time: e.detail.value
      })
  },
  bindCountryCodeChange: function(e){
      console.log('picker country code 发生选择改变，携带值为', e.detail.value);

      this.setData({
          countryCodeIndex: e.detail.value
      })
  },
  formSubmit(e){
    console.log(e.detail.value)
    let name = e.detail.value.name
    let describle = e.detail.value.describle
    let endTime = e.detail.value.endTime
    let value =e.detail.value.value
    let money = e.detail.value.money
    let imgUrl = this.data.imgUrl
    let imageUrl = this.data.imageUrl
    let putawayStatus = this.data.putawayStatus
    let card_no = util.wxuuid(16,16)
    console.log(card_no)
    if(name==''||describle==''||endTime==''||value==''||money==''||imageUrl==''||imgUrl==''){
      this.setData(
        { popErrorMsg: "请将信息填写完整再提交" }
      ); 
      this.ohShitfadeOut(); 
      return;  
    }

    //管理员新增会员卡
    var myDate = new Date()
    const db = wx.cloud.database()
    db.collection('card').add({
      data:{
        value:value,
        money:money,
        card_no:card_no,
        status:putawayStatus,
        imgUrl:imgUrl,
        imageUrl:imageUrl,
        name:name,
        remark:'',
        describle:describle,
        card_type:'',
        indate:0,
        create_time:myDate.toLocaleString(),
        update_time:myDate.toLocaleString(),
        start_time:myDate.toLocaleString(),
        end_time:endTime
      },
      success:res=>{
        //返回订单ID
        this.setData({
          cardId:res._id
        })
        //跳转页面（返回页面）
        wx.navigateBack({
          complete: (res) => {},
          delta:1
        })
      },
      fail:err=>{
        wx.showToast({
          icon:'none',
          title: '添加会员卡失败，请稍后重试',
          duration:2000
        })
      }
    })

  },
   //定时器提示框3秒消失
   ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  },
  //面值
  bindValueChange: function(e) {
    this.setData({
        valueIndex: e.detail.value
    })
  },

  //价格
  bindMoneyChange: function(e) {
    this.setData({
        moneyIndex: e.detail.value
    })
  },
  //上架
  putaway:function(e){
    let checked = e.detail.value
    this.setData({
      putawaycheck:checked
    })
    //如果选中表示产品上架
    if(checked == true){
      this.setData({
        putawayStatus:1
      })
    }else{
      this.setData({
        putawayStatus:2
      })
    }
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
        const cloudPath = 'club-card/'+imageName+ filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            if(id == '1'){
              that.setData({
                imgUrl:res.fileID
              })
            }else{
              that.setData({
                imageUrl:res.fileID
              })
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

  bindAccountChange: function(e) {
      console.log('picker account 发生选择改变，携带值为', e.detail.value);

      this.setData({
          accountIndex: e.detail.value
      })
  },
  bindAgreeChange: function (e) {
      this.setData({
          isAgree: !!e.detail.value.length
      });
  }
});