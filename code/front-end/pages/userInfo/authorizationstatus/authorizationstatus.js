// pages/userInfo/authorizstionstatus/authorizationstatus.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorization:{
      name: undefined,
      ID: undefined,
      sex: undefined,
      school: undefined,
      major: undefined,
    }
  },
  changeAuthorization: function(){
    wx.navigateTo({
      url: '../authorization/authorization',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp()
    if(app.globalData.ourUserInfo.authorization != null){
      this.setData({
        authorization: app.globalData.ourUserInfo.authorization
      })
    }
    else{
      wx.showToast({
        title: '您还未进行认证',
        image: '/images/fail.png',
      })
    }

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