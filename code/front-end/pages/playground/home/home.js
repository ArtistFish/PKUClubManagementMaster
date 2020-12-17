let app = getApp()
Component({
  data: {
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }],
    recommendList: [],
    recommendIds: [],
    clubList: [],
    clubIds: [],
    recentList:[],
    gridCol: 3,
    tabCur: 'all',
    loaded: false,
    keyWords: '',
  },
  lifetimes:{
    ready: function(){
      let _this = this
      new Promise((resolve, reject) => {
        app.getClubList(res => {
          if(res.data.status != '200 OK'){
            reject(res)
          }
          else
            resolve(res.data.club_list)
      })
      }).then(club_list => {
        let clubList = []
        let cnt = 0
        let clubIds = []
        let length = club_list.length
        if(length == 0){
          _this.setData({
            loaded: true,
          })
        }
        for(let club of club_list){
          let id = club[0]
          app.getClubInfo(id, res => {
            cnt += 1
            clubIds.push(id)
            clubList.push(res.data)
            if(cnt == length){
              _this.setData({
                clubList: clubList,
                clubIds: clubIds,
                loaded: true,
                recommendList: clubList.slice(0, 6),
                recommendIds: clubIds.slice(0, 6),
              })
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  options:{
    addGlobalClass: true
  },
  methods:{
    tabSelect: function(e){
      this.setData({
        tabCur:e.currentTarget.dataset.list
      })
    },
    tapRecommend: function(e){
      let index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '/pages/club/frontpage/frontpage?club_id=' + this.data.recommendIds[index]
      })
    },
    tapClub: function(e){
      let index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '/pages/club/frontpage/frontpage?club_id=' + this.data.clubIds[index]
      })
    },
    tapJoin: function(e){
      if(app.globalData.personel.authorization.is_authorized == false){
        wx.showModal({
          title: '您还未进行学生认证!',
          cancelText: '下次吧',
          confirmText: '马上去',
          success: function(res){
            if(res.confirm){
              wx.navigateTo({
                url: '/pages/userInfo/authorization/authorization',
              })
            }
          }
        })
      }
      else{
        let index = e.currentTarget.dataset.index
        let club_id = this.data.clubList[index].club_id
        app.addMemberToClub(club_id, res => {
          if(res.data.status != '200 OK'){
            wx.showToast({
              title: '加入社团失败',
              image: '/images/fail.png',
            })
          }
          else{
            wx.showToast({
              title: '加入社团成功',
            })
          }
        })
      }
    },
    editInput: function(e){
      this.setData({
        keyWords: e.detail.value
      })
    },
    tapSearch: function(e){
      wx.showLoading({
        title: '搜索中',
      })
      console.log(this.data.keyWords)
      app.getRelatedClubList(this.data.keyWords, res => {
          wx.hideLoading()
          let list = []
          for(let obj of res.data.related_club_list){
            list.push(obj[0])
          }
          list = JSON.stringify(list)
          wx.navigateTo({
            url: '/pages/playground/search/search?list=' + list
          })
        })
    }
  }
})