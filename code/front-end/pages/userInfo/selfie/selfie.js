// pages/userInfo/selfie/selfie.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 'clubs',
    loaded: false,
    infoList: {moments: [], clubs: []},
    hasUserInfo: false,
  },
  tabSelect: function(e){
    this.setData({
      tabCur: e.currentTarget.dataset.cur
    })
  },
  tapClub: function(e){
    let index = e.currentTarget.dataset.index
    let club_id = this.data.idList[this.data.tabCur][index]
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
    app.getUserInfo(wx_id, res => {
      if(res.data.status == '200 OK'){
        _this.setData({
          user_name: res.data.user_name,
          head_url: res.data.head_url,
          hasUserInfo: true,
        })
      }
    })
    app.getClubListOfUser(wx_id, res => {
      let idList = {moment: [], clubs: []}
      for(let club of res.data.president_club_list){
        idList.clubs.push(club[0])
      }
      for(let club of res.data.manager_club_list){
        idList.clubs.push(club[0])
      }
      for(let club of res.data.member_club_list){
        idList.clubs.push(club[0])
      }
      idList.clubs = Array.from(new Set(idList.clubs))
      _this.setData({
        idList: idList,
      })
      let clubList = {}
      let pictureList = {}
      let cnt1 = 0
      let cnt2 = 0
      let length = _this.data.idList.clubs.length
      if(length == 0){
        _this.setData({
          loaded: true,
        })
      }
      for(let id of _this.data.idList.clubs){
        app.getClubInfo(id, res => {
          if(res.data.status == '200 OK'){
            clubList[id] = res.data
          cnt1 += 1
          if(cnt1 == length && cnt2 == length){
            _this.setData({
              clubList: clubList,
              pictureList: pictureList,
              loaded: true,
              })
            }
          }
        })
      app.getClubPictures(id, res => {
        if(res.data.status == '200 OK'){
          let pic_list = []
          for(let path of res.data.club_pictures_list){
            pic_list.push(app.globalData.SERVER_ROOT_URL + path[1])
          }
          pictureList[id] = pic_list
          cnt2 += 1
          if(cnt1 == length && cnt2 == length){
            _this.setData({
              clubList: clubList,
              pictureList: pictureList,
              loaded: true,
            })
           }
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