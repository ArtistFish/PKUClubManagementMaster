// pages/login/login.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    get_openid: false,
    get_userInfo: false,
    hide: true,
  },
  bindGetUserInfo: function(e){
    if(e.detail.userInfo){
      app.globalData.wxUserInfo = e.detail.userInfo
      this.setData({
        get_userInfo: true,
      })
      if (app.userInfoReadyCallback) {
        app.userInfoReadyCallback(res)
      }
      if(this.data.get_openid && this.data.get_userInfo){
        wx.navigateTo({
          url: '/pages/index/index',
        })
      }
    }
    else{
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
            // 用户没有授权成功，不需要改变 isHide 的值
            if (res.confirm) {
                console.log('用户点击了“返回授权”');
            }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    app.getOpenid(res => {
      _this.setData({
        get_openid: true,
      })
      if(_this.data.get_openid == true && _this.data.get_userInfo == true){
        wx.navigateTo({
          url: '/pages/index/index',
        })
      }
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.wxUserInfo = res.userInfo
              console.log('get userinfo success', res.userInfo)
              if (app.userInfoReadyCallback) {
                app.userInfoReadyCallback(res)
              }
              _this.setData({
                get_userInfo: true,
              })
              if(_this.data.get_openid == true && _this.data.get_userInfo == true){
                wx.navigateTo({
                  url: '/pages/index/index',
                })
              }
            },
            fail: res => {
              console.log('wx.getUserInfo fail', res)
            }
          })
        }
        else{
          _this.setData({
            hide: false,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})