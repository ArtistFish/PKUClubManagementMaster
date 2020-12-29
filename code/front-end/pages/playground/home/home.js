const app = getApp();
const Api = app.require('utils/util.js');
Component({
  data: {
    recommendList: [],
    recommendIds: [],
    clubList: [],
    clubIds: [],
    clubJoined: [],
    recentList:[],
    gridCol: 3,
    tabCur: 'all',
    data_loaded: false,
    join_loaded: false,
    collector_loaded: false,
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
          {
            let clubIds = []
            for(let club of res.data.club_list){
              clubIds.push(club[0])
            }
            _this.setData({
              clubIds: clubIds
            })
            resolve()
          }
      })
      }).then(() => {
        let clubList = {}
        let pictureList = {}
        let collectorList = {}
        let length = _this.data.clubIds.length
        let cnt1 = 0
        let cnt2 = 0
        let cnt3 = 0
        if(length == 0){
          _this.setData({
            clubList: clubList,
            pictureList: pictureList,
            recommendIds: [],
            data_loaded: true
          })
        }
        // console.log(_this.data.clubIds)
        for(let id of _this.data.clubIds){
          app.getClubCollectors(id, res => {
            collectorList[id] = res.data.club_collector_list
            cnt3 += 1
            if(cnt3 == length){
              _this.setData({
                collectorList: collectorList,
                collector_loaded: true,
              })
            }
          })
          app.getClubInfo(id, res => {
            if(res.data.status == '200 OK'){
              cnt1 += 1
              clubList[id] = res.data
              if(cnt1 == length && cnt2 == length){
                _this.setData({
                  clubList: clubList,
                  recommendIds: _this.data.clubIds.slice(0, 6),
                  data_loaded: true
                })
              }
            }
          })
          app.getClubPictures(id, res => {
            if(res.data.status == '200 OK'){
              cnt2 += 1
              let pic_li = []
              for(let path of res.data.club_pictures_list){
                pic_li.push(app.globalData.SERVER_ROOT_URL + path[1])
              }
              pictureList[id] = pic_li
              if(cnt1 == length && cnt2 == length){
                _this.setData({
                  clubList: clubList,
                  pictureList: pictureList,
                  recommendIds: _this.data.clubIds.slice(0, 6),
                  data_loaded: true
                })
              }
            }
          })
        }
        Api.get_relations(relations => {
          _this.getJoinStatus(relations, _this)
        })
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
      let index = e.currentTarget.dataset.index
      let club_id = this.data.clubIds[index]
      Api.join_club(club_id, relations=>{
        this.getJoinStatus(relations, this)
      })
    },  
    getJoinStatus: function(relations, _this) {
      let joined = []
        for(let club_id of _this.data.clubIds)
        {
          let flag = false
          if (relations[club_id] !== undefined)
          {
            flag = true
          }
          joined.push(flag)
        }
        _this.setData({
          clubJoined: joined,
          join_loaded: true
        })
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