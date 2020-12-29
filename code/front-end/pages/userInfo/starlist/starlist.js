// pages/userInfo/starlist/starlist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 'club',
    infoList:{club: [], activity: []}
  },
  tapClub: function(e){
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/club/frontpage/frontpage?club_id=' + this.data.idList[this.data.tabCur][index],
    })
  },
  tabSelect: function(e){
    this.setData({
      tabCur: e.currentTarget.dataset.cur
    })
  },
  tapBtnClub: function(){
    let destination = undefined
    if(this.data.tabCur == 'club'){
      destination = 'playground'
    }
    else{
      destination = 'activity'
    }
    wx.navigateTo({
      url: '../../index/index?CurPage=' + destination,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let obj = JSON.parse(options.obj)
    _this.setData({
      idList: {club: obj[0].collector, activity: obj[1].collected}
    })
    let clubList = {}
    let clubPictureList = {}
    let activityList = {}
    let activityPictureList = {}
    let cnt1 = 0
    let cnt2 = 0
    let cnt3 = 0
    let cnt4 = 0
    let length1 = _this.data.idList.club.length
    let length2 = _this.data.idList.activity.length
    let start_time
    let end_time
    // console.log(clubIds)
    if(length1 == 0)
    {
      _this.setData({
        clubLoaded: true,
      })
    }
    if(length2 == 0){
      _this.setData({
        activityLoaded: true,
      })
    }
    _this.setData({
      loaded: (length1 == 0 && length2 == 0)
    })
    for(let id of _this.data.idList.club){
      app.getClubInfo(id, res => {
        // if(res.data.status == '200 OK'){
          clubList[id] = res.data
          cnt1 += 1
          if(cnt1 == length1 && cnt2 == length1){
            _this.setData({
              clubList: clubList,
              clubPictureList: clubPictureList,
              clubLoaded: true,
            })
            if(_this.data.activityLoaded){
              _this.setData({
                loaded: true,
              })
            }
          }
        // }
      })
      app.getClubPictures(id, res => {
        // if(res.data.status == '200 OK'){
          let pic_list = []
          for(let pic of res.data.club_pictures_list){
            pic_list.push(app.globalData.SERVER_ROOT_URL + pic[1])
          }
          clubPictureList[id] = pic_list
          cnt2 += 1
          if(cnt1 == length1 && cnt2 == length1){
            _this.setData({
              clubList: clubList,
              clubPictureList: clubPictureList,
              clubLoaded: true,
            })
            if(_this.data.activityLoaded){
              _this.setData({
                loaded: true,
              })
            }
          }
        // }
      })
    }
    for(let id of _this.data.idList.activity){
      app.getActivityInfo(id, res => {
        start_time = res.data.activity_start_time
        end_time = res.data.activity_end_time
        res.data.activity_start_time = new Date(start_time).toLocaleDateString()
        res.data.activity_end_time = new Date(end_time).toLocaleDateString()
        activityList[id] = res.data
        cnt3 += 1
        if(cnt3 == length2 && cnt4 == length2){
          _this.setData({
            activityList: activityList,
            activityPictureList: activityPictureList,
            activityLoaded: true,
          })
          if(_this.data.clubLoaded){
            _this.setData({
              loaded: true,
            })
          }
        }
      })
      app.getActivityPictures(id, res => {
        // if(res.data.status == '200 OK'){
          let pic_list = []
          for(let pic of res.data.club_pictures_list){
            pic_list.push(app.globalData.SERVER_ROOT_URL + pic[1])
          }
          activityPictureList[id] = pic_list
          cnt4 += 1
          if(cnt3 == length2 && cnt4 == length2){
            _this.setData({
              activityList: activityList,
              activityPictureList: activityPictureList,
              activityLoaded: true,
            })
            if(_this.data.clubLoaded){
              _this.setData({
                loaded: true,
              })
            }
          }
        // }
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