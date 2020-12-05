// pages/userInfo/home/home.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  data: {
    hasUserInfo:false,
    wxUserInfo:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo: function(event)
    {
      console.log(event)
      app.globalData.wxUuserInfo = event.detail.userInfo
      this.setData({
        wxUserInfo: event.detail.userInfo,
        hasUserInfo:true
      })
    },
    navigation: function(e){
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  lifetimes:{
    attached:function(){
      if(app.globalData.wxUserInfo != null)
      {
        this.setData({
          hasUserInfo:true,
          wxUserInfo:app.globalData.wxUserInfo
        })
      }
      else
      {
        app.userInfoReadyCallback = res => {
          this.setData({
            hasUserInfo:true,
            wxUserInfo:res.userInfo
          })
        }
      }
    }
  },
  options:{
    addGlobalClass: true
  }
})
