// pages/userInfo/clublist/clublist.js
let app = getApp();
const Api = app.require('utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 'join',
    infoList: {
      join: [],
      setup: [],
    },
    idList: {
      join: [],
      setup: [],
    },
    loaded: false,
    hided: false,
  },
  tapExit: function(e) {
    let index = e.currentTarget.dataset.index
    let club_id = this.data.idList[this.data.tabCur][index]
    Api.quit_club(club_id, relations=>{
      {
        this.setData({
          loaded: false
        })
      }
      let club_id_list = this.data.idList.join
      club_id_list.splice(index, 1)
      let club_info_list = this.data.infoList.join
      club_info_list.splice(index, 1)
      {
        this.setData({
          "infoList.join": club_info_list,
          "idList.join": club_id_list,
          loaded: true,
        })
      }
    })
  },
  tabSelect: function(e){
    this.setData({
      tabCur: e.currentTarget.dataset.cur
    })
  },
  tapBtnClub: function(e){
    wx.navigateTo({
      url: '../../index/index?CurPage=playground',
    })
  },
  tapSetup: function(e){
    wx.navigateTo({
      url: '/pages/playground/signup/signup'
    })
  },
  tapClub: function(e){
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/club/frontpage/frontpage?club_id=' + this.data.idList[this.data.tabCur][index],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let obj = JSON.parse(options.obj)
    let join_id = []
    let setup_id = []
    let join = []
    let setup = []
    let cnt1 = 0
    let cnt2 = 0
    let length1 = obj.join.length
    let length2 = obj.setup.length
    if(length1 == 0 && length2 == 0)
    {
      _this.setData({
        loaded: true,
      })
    }
    for (let id of obj.join){
      app.getClubInfo(id, res => {
        join.push(res.data)
        join_id.push(id)
        cnt1 += 1
        if(cnt1 == length1 && cnt2 == length2){
          _this.setData({
            infoList:{
              join: join,
              setup: setup,
            },
            idList: {
              join: join_id,
              setup: setup_id,
            },
            loaded: true,
          })
        }
      })
    }
    for (let id of obj.setup){
      app.getClubInfo(id, res => {
        setup.push(res.data)
        setup_id.push(id)
        cnt2 += 1
        if(cnt1 == length1 && cnt2 == length2){
          _this.setData({
            infoList:{
              join: join,
              setup: setup,
            },
            idList: {
              join: join_id,
              setup: setup_id,
            },
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
    if(this.data.hided){
      // hided为true则表示刚从创建社团页面返回，需要进行刷新
      let _this = this
      _this.setData({
        loaded: false,
      })
      let idList = {join: _this.data.idList.join, setup: []}
      let infoList = {join: _this.data.infoList.join, setup: []}
      app.getClubListOfUser(app.globalData.openid, res => {
        let cnt = 0
        let length = res.data.president_club_list.length
        let setup_clubs = res.data.president_club_list
        for(let club of setup_clubs){
          let id = club[0]
          idList.setup.push(id)
          app.getClubInfo(id, res => {
            infoList.setup.push(res.data)
            cnt += 1
            if(cnt == length){
              _this.setData({
                infoList: infoList,
                idList: idList,
                loaded: true,
              })
            }
          })
        }
      })
    }
    this.setData({
      hided: false,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      hided: true,
    })
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