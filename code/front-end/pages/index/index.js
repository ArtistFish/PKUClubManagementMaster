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
    app.getMessages(res => {
      let receive_messages = res.data.receive_message_list
      let unread_cnt = 1
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
