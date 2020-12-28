// pages/userInfo/edit/edit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: 'null',
    innerText: 'null'
  },
  editInput: function(e){
    this.setData({
      innerText: e.detail.value
    })
  },
  tapCommit: function(e){
    app.setUserInfo(this.data.innerText, res => {
      console.log(res)
      if(res.data.status == '200 OK'){
        wx.showToast({
          title: '修改成功'
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/index/index?CurPage=userInfo'
          })
        }, 500)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title:options.title,
      innerText: options.innerText
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