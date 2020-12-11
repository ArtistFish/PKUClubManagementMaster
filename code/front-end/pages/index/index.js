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
  //事件处理函数
  // 如果后续操作需要用户信息，但是app.globalData.userInfo为空，主动请求用户进行授权登陆
  // onReady: function(){
  //   let _this = this
  //   wx.showModal({
  //     cancelColor: 'cancelColor',
  //     content: '请授权登陆',
  //     success: function(res){
  //       if(res.confirm){
  //         _this.setData({
  //           CurPage: 'userInfo'
  //         })
  //       }
  //     }
  //   })
  // }
})
