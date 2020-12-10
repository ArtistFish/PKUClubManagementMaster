// pages/userInfo/detail/detail.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  editInfo: function(e){
    let innerText = undefined
    let title = e.currentTarget.dataset.cur
    if(title == '姓名'){
      innerText = app.globalData.ourUserInfo.name
    }
    else if(title == '年龄'){
      innerText = app.globalData.ourUserInfo.age
    }
    else if(title == '性别'){
      innerText = app.globalData.ourUserInfo.sex
    }
    else if(title == '学校'){
      innerText = app.globalData.ourUserInfo.school
    }
    else
      throw Error('unkonw edit title type!')
    wx.navigateTo({
      url: '../edit/edit?title=' + title + '&innerText=' + innerText,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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