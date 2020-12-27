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
  tapActivity: function(e){
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let activity_id = this.data.idList[this.data.tabCur][type][index]
    wx.navigateTo({
      url: '/pages/activity/activity_detail/activity_detail?activity_id=' + activity_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let associated_activity_ids = JSON.parse(options.obj)
    let cur_time = new Date().getTime()
    this.setData({
      cur_time: cur_time
    })
    let infoList = {registered: {during: [], finished: []}, selected: {during: [], finished: []}, setup: {during: [], finished: []}}
    let idList = {registered: {during: [], finished: []}, selected: {during: [], finished: []}, setup: {during: [], finished: []}}
    let cnt1 = 0
    let cnt2 = 0
    let length1 = associated_activity_ids.registered.length
    let length2 = associated_activity_ids.selected.length
    let _this = this
    let start_time
    let end_time
    if(length1 == 0 && length2 == 0){
      _this.setData({
        loaded: true,
      })
    }
    for(let id of associated_activity_ids.registered){
      app.getActivityInfo(id, res => {
        start_time = res.data.activity_start_time
        end_time = res.data.activity_end_time
        res.data.activity_start_time = new Date(start_time).toLocaleDateString()
        res.data.activity_end_time = new Date(end_time).toLocaleDateString()
        if(new Date(res.data.activity_end_time).getTime() < _this.data.cur_time){
          infoList.registered.finished.push(res.data)
          idList.registered.finished.push(id)
        }
        else{
          infoList.registered.during.push(res.data)
          idList.registered.during.push(id)
        }
        cnt1 += 1
        if(cnt1 == length1 && cnt2 == length2){
          _this.setData({
            infoList: infoList,
            idList: idList,
            loaded: true,
          })
        }
      })
    }
    for(let id of associated_activity_ids.selected){
      app.getActivityInfo(id, res => {
        start_time = res.data.activity_start_time
        end_time = res.data.activity_end_time
        res.data.activity_start_time = new Date(start_time).toLocaleDateString()
        res.data.activity_end_time = new Date(end_time).toLocaleDateString()
        if(new Date(res.data.activity_end_time).getTime() < _this.data.cur_time){
          infoList.selected.finished.push(res.data)
          idList.selected.finished.push(id)
        }
        else{
          infoList.selected.during.push(res.data)
          idList.selected.during.push(id)
        }
        cnt2 += 1
        if(cnt1 == length1 && cnt2 == length2){
          _this.setData({
            infoList: infoList,
            idList: idList,
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