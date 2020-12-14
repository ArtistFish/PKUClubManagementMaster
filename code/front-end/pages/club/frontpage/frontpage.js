// pages/frontpage/frontpage.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft:0,
    Tabs: ["社团详情", "社团活动", "社团动态", "社团人员"],
    member_number: 0,
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let club_id = options.club_id
    let _this = this
    this.setData({
      loaded_info: false,
      loaded_manager: false,
      loaded_member: false
    })
    new Promise((resolve, reject) => {
      app.getClubInfo(club_id, function(res){
        let cur_club = res.data
        app.globalData.current_club = cur_club
        app.globalData.current_club.club_id = club_id
        // console.log(cur_club)
        _this.setData({
            loaded_info: true,
            club_name: cur_club.club_name,
            club_tag: cur_club.club_tag,
        })
        resolve()
      })
    }).then(() => {
      app.getClubMembers(club_id, res=>{
        let member_list = res.data.club_member_list
        app.globalData.current_club.member_list = member_list
        // console.log('member', res)
        _this.setData(
          {
            loaded_member: true,
            member_number: _this.data.member_number + member_list.length + 1
          })
      })
      app.getClubManagers(club_id, res=>{
        let manager_list = res.data.club_manager_list
        app.globalData.current_club.manager_list = manager_list
        // console.log('manager', res)
        _this.setData(
          {
            loaded_manager: true,
            member_number: _this.data.member_number + manager_list.length
          })
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData()
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

  },
})