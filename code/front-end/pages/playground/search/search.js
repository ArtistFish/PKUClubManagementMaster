// pages/playground/search/search.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultIds: [],
    resultList: [],
    loaded: false,
  },
  tapClub: function(e){
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/playground/frontPage/frontPage?club_id=' + this.data.resultIds[index],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let resultIds = JSON.parse(options.list)
    let resultList = []
    let cnt = 0
    let length = resultIds.length
    let _this = this
    if(length == 0){
      _this.setData({
        loaded: true,
        resultIds: resultIds,
      })
    }
    for(let id of resultIds){
      app.getClubInfo(id, res => {
        resultList.push(res.data)
        cnt += 1
        if(cnt == length){
          _this.setData({
            loaded: true,
            resultIds: resultIds,
            resultList: resultList,
          })
        }
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