//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    CurPage: 'playground',
    unread_cnt: 0,
  },
  NavChange(e){
    this.setData({
      CurPage: e.currentTarget.dataset.cur
    })
  },
  onPullDownRefresh: function(e){
    setTimeout(()=>{
      console.log('refresh')
    }, 500)
  },
  onLoad: function(option){
    let _this = this
    // 如果是未注册用户，先注册一下
    // console.log(app.globalData.openid)
    app.getUserInfo(app.globalData.openid, res => {
      if(res.data.status == 'Not Found'){
        app.createUser(app.globalData.openid, app.globalData.wxUserInfo.nickName, app.globalData.wxUserInfo.avatarUrl, res => {
          if(res.data.status != '200 OK'){
            wx.showToast({
              title: '注册用户失败',
              image: '/images/fail.png'
            })
          }
        })
      }
    })
    // todo:在这里处理未读消息数量
    app.getMessages(res => {
      let receive_messages = res.data.receive_message_list
      let unread_cnt = 0
      for(let message of receive_messages){
        let content = JSON.parse(message[3])
        if(!content.read){
          unread_cnt += 1
        }
      }
      _this.setData({
        unread_cnt: unread_cnt
      })
    })
    if(option && option.CurPage){
      this.setData({
        CurPage: option.CurPage,
      })
    }
  }
})
