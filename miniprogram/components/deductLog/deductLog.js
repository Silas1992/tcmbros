// components/pointsLog/pointsLog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cardRecord:{
      type:Array,
      value:[]
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    newRecord:[]
  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function(options) {
      console.log('来了')
      // 在组件实例进入页面节点树时执行
      var cardRecord = this.properties.cardRecord
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
          //计算当月的总工资
          newRecord.push({
            year:item.year,
            month:item.month,
            total:item.de_money,
            subList:[item]
          })
        }else{
          newRecord[index].subList.push(item)
          //计算当月的总工资
          console.log('当前总工资',newRecord[index].total,item.de_money)
          console.log('当前总工资',parseFloat(newRecord[index].total),parseFloat(item.de_money))
          console.log('--------', parseFloat(item.de_money).toFixed(2))
          newRecord[index].total = parseFloat(newRecord[index].total) + parseFloat(item.de_money)
        }
      })

      this.setData({
        newRecord:newRecord
      })
      console.log('哈哈哈',this.data.newRecord)

    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function() {
    console.log('来了')
    // 在组件实例进入页面节点树时执行
    var cardRecord = this.properties.cardRecord
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
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },

  /**
   * 组件的方法列表
   */
  methods: {


  }
})
