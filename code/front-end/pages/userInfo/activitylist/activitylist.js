// pages/userInfo/activitylist/activitylist.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 'registered',
    infoList: {registered: {during: [], finished: []}, selected: [], setup: []},
    loaded: false,
  },
  tabSelect: function(e){
    this.setData({
      tabCur: e.currentTarget.dataset.cur
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let associated_activity_ids = JSON.parse(options.obj)
    let infoList = {registered: {during: [], finished: []}, selected: [], setup: []}
    let cnt1 = 0
    let cnt2 = 0
    let length1 = associated_activity_ids.registered.length
    let length2 = associated_activity_ids.selected.length
    let _this = this
    if(length1 == 0 && length2 == 0){
      _this.setData({
        loaded: true,
      })
    }
    for(let id of associated_activity_ids.registered){
      app.getActivityInfo(id, res => {
        infoList.registered.during.push(res.data)
        cnt1 += 1
        if(cnt1 == length1 && cnt2 == length2){
          _this.setData({
            infoList: infoList,
            loaded: true,
          })
        }
      })
    }
    for(let id of associated_activity_ids.selected){
      app.getActivityInfo(id, res => {
        infoList.selected.during.push(res.data)
        cnt2 += 1
        if(cnt1 == length1 && cnt2 == length2){
          _this.setData({
            infoList: infoList,
            loaded: true,
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