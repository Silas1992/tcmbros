const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    console.log('当前的参数为',event)
    const result = await cloud.openapi.uniformMessage.send({
        "touser": event.openid,
        "mpTemplateMsg": {
          "appid": 'wx3638fcdb465a8215',
          "url": 'http://weixin.qq.com/download',
          "miniprogram": {
            "appid": 'wx5c4e408fb57d8045',
            "pagepath": 'pages/client/consume/consume'
          },
          "data": {
            "productType": {
              "value": '商品名',
              "color": '#173177'
            },
            "name": {
              "value": event.goods_name,
              "color": '#173177'
            },
            "accountType": {
              "value": '会员卡号',
              "color": '#173177'
            },
            "account": {
              "value": event.card_no,
              "color": '#173177'
            },
            "time": {
              "value": event.create_time,
              "color": '#173177'
            },
            "remark": {
              "value": '欢迎再次购买！',
              "color": '#173177'
            }
          },
          "templateId": 'Pv8re6HOKHr0jnGCvOQsGOwhMkoMPoXVVsXI4YVEbnE',
          "miniprogramState":'developer'
        }
      })
    return result
  } catch (err) {
    return err
  }
}

