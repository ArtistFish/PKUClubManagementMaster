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
      url: '/pages/club/frontpage/frontpage?club_id=' + this.data.resultIds[index],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let resultIds = JSON.parse(options.list)
    _this.setData({
      resultIds: resultIds
    })
    let resultList = {}
    let pictureList = {}
    let cnt1 = 0
    let cnt2 = 0
    let length = resultIds.length
    if(length == 0){
      _this.setData({
        loaded: true,
      })
    }
    for(let id of resultIds){
      app.getClubInfo(id, res => {
        if(res.data.status == '200 OK'){
          resultList[id] = res.data
          cnt1 += 1
          if(cnt1 == length && cnt2 == length){
            _this.setData({
              loaded: true,
              pictureList: pictureList,
              resultList: resultList,
            })
          }
        }
      })
      app.getClubPictures(id, res => {
        let pic_list = []
        for(let path of res.data.club_pictures_list){
          pic_list.push(app.globalData.SERVER_ROOT_URL + path[1])
        }
        pictureList[id] = pic_list
        cnt2 += 1
        if(cnt1 == length && cnt2 == length){
          _this.setData({
            loaded: true,
            pictureList: pictureList,
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