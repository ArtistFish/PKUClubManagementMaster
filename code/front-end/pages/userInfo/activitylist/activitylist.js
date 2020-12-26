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
  createActivity: function(e){
    let wx_id = app.globalData.openid
    let club_list = []
    app.getClubListOfUser(wx_id, res => {
      club_list.push(...res.data.president_club_list)
      club_list.push(...res.data.manager_club_list)
      if(club_list.length > 0){
        let names = []
        let ids = []
        for(let club of club_list){
          names.push(club[1])
          ids.push(club[0])
        }
        wx.showActionSheet({
          itemList: names,
          success: res => {
            let index = res.tapIndex
            wx.navigateTo({
              url: '/pages/activity/createActivity/createActivity?club_id=' + ids[index],
            })
          },
          fail (res) {
            console.log(res.errMsg)
          }
        })
      }
      else{
        wx.showToast({
          title: '您没有管理的社团',
          icon: 'none'
        })
      }
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