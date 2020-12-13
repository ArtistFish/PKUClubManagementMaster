//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    CurPage: 'playground'
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
    if(option && option.CurPage){
      this.setData({
        CurPage: option.CurPage,
      })
    }
  }
})
