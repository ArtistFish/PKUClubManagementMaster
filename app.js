//app.js
App({
  onLaunch: function () {
    let app_this = this
    wx.request({
      url: this.globalData.SERVER_URL + "/getClubInfo?club_id=2",
      method: 'POST',
      success: res=>{
        app_this.globalData.clubInfo = res.data
        console.log(app_this.globalData)
      },
      fail: res=>{
        console.log(res)
      }
    })
    // wx.request({
    //     url: this.globalData.SERVER_URL + "/getMessages",
    //     data: {
    //       wx_id: 0
    //     },
    //     method: 'POST',
    //     success: res=>{
    //       console.log(res.data)
    //     }
    //   })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
		if (capsule) {
		 	this.globalData.Custom = capsule;
			this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
		} else {
			this.globalData.CustomBar = e.statusBarHeight + 50;
		}
      }
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userIsManager: false,
    userIsPresident: true,
    userIsMember: true,
    userName: "zrf",
    SERVER_URL: "http://47.92.240.179:5000/gp10"
  }
})
