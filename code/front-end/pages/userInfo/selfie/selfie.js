// pages/userInfo/selfie/selfie.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 'moments',
    loaded: false,
    infoList: {moments: [], clubs: []}
  },
  tabSelect: function(e){
    this.setData({
      tabCur: e.currentTarget.dataset.cur
    })
  },
  tapClub: function(e){
    let club_id = this.data.clubIds[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '/pages/club/frontpage/frontpage?club_id=' + club_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let wx_id = options.wx_id
    let _this = this
    app.getClubListOfUser(wx_id, res => {
      let _clubs = []
      _clubs.push(...(res.data.president_club_list))
      _clubs.push(...(res.data.manager_club_list))
      _clubs.push(...(res.data.member_club_list))
      _clubs = Array.from(new Set(_clubs))
      let clubIds = []
      let clubs = []
      let cnt = 0
      let length = _clubs.length
      if(length == 0){
        _this.setData({
          clubIds: clubIds,
          loaded: true,
        })
      }
      for(let club of _clubs){
        let id = club[0]
        app.getClubInfo(id, res => {
          clubIds.push(id)
          clubs.push(res.data)
          cnt += 1
          if(cnt == length){
            _this.setData({
              clubIds: clubIds,
              infoList: {
                moments: [],
                clubs: clubs,
              },
              loaded: true,
            })
          }
        })
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