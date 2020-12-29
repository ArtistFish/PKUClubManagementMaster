// pages/clubInfo/info.js
const app = getApp();
const Api = app.require('utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true
  },
  lifetimes: {
    created: function (options) {
    },
    attached: function () {
      Api.set_current_user(this)
    },
    ready: function () {
      // app = getApp()
      // console.log(app.globalData.userIsPresident)
      let cur_club = app.globalData.current_club
      let swiperList = []
      for (let pic_url of cur_club.display_pictures)
      {
        swiperList.push({pic_url})
      }
      this.setData({
        swiperList: swiperList,
        detailPageContents: {
          "社团概况": app.globalData.current_club.club_description,
          "活动介绍": "这家社团没有任何活动",
          "入会费用": "100万",
          "联系我们": cur_club.contact_QR
        },
        }
      )
      this.towerSwiper('swiperList');
      // 初始化towerSwiper 传已有的数组名即可
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    cardCur: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeClubInfo() {
      wx.navigateTo({
        url: '/pages/club/changeInfo/changeInfo',  
        })
    },
    DotStyle(e) {
      this.setData({
        DotStyle: e.detail.value
      })
    },
    // cardSwiper
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },
    // towerSwiper
    // 初始化towerSwiper
    towerSwiper(name) {
      let list = this.data[name];
      for (let i = 0; i < list.length; i++) {
        list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
        list[i].mLeft = i - parseInt(list.length / 2)
      }
      this.setData({
        swiperList: list
      })
    },
    // towerSwiper触摸开始
    towerStart(e) {
      this.setData({
        towerStart: e.touches[0].pageX
      })
    },
    // towerSwiper计算方向
    towerMove(e) {
      this.setData({
        direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
      })
    },
    // towerSwiper计算滚动
    towerEnd(e) {
      let direction = this.data.direction;
      let list = this.data.swiperList;
      if (direction == 'right') {
        let mLeft = list[0].mLeft;
        let zIndex = list[0].zIndex;
        for (let i = 1; i < list.length; i++) {
          list[i - 1].mLeft = list[i].mLeft
          list[i - 1].zIndex = list[i].zIndex
        }
        list[list.length - 1].mLeft = mLeft;
        list[list.length - 1].zIndex = zIndex;
        this.setData({
          swiperList: list
        })
      } else {
        let mLeft = list[list.length - 1].mLeft;
        let zIndex = list[list.length - 1].zIndex;
        for (let i = list.length - 1; i > 0; i--) {
          list[i].mLeft = list[i - 1].mLeft
          list[i].zIndex = list[i - 1].zIndex
        }
        list[0].mLeft = mLeft;
        list[0].zIndex = zIndex;
        this.setData({
          swiperList: list
        })
      }
    },
    joinClub() {
      let club_id = app.globalData.current_club.club_id
      Api.join_club(club_id, () => {
        this.triggerEvent('refresh', {tab: 0, club_id: club_id})
      })
    }
  }
})
