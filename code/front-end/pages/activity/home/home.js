let app = getApp()
const Api = app.require('utils/util.js');
Component({
  data: {
    recommendList: [],
    recommendIds: [],
    gridCol: 2,
    tabCur: 'all',
    loaded: false,
    activityList: [],
    activityIds: []
  },
  options:{
    addGlobalClass: true
  },
  lifetimes:{
    ready: function(e){
      let _this = this
      new Promise((resolve, reject) => {
        app.getActivityList(res => {
          if(res.data.status != '200 OK'){
            reject(res)
          }
          else{
            // resolve(res.data.activity_list)
            let activityIds = []
            for(let activity of res.data.activity_list){
              activityIds.push(activity[0])
            }
            _this.setData({
              activityIds: activityIds
            })
            resolve()
          }
      })
      }).then(() => {
        let activityList = {}
        let pictureList = {}
        let length = _this.data.activityIds.length
        let cnt1 = 0
        let cnt2 = 0
        if(length == 0){
          _this.setData({
            activityList: activityList,
            pictureList: pictureList,
            recommendIds: [],
            data_loaded: true
          })
        }
        for(let id of _this.data.activityIds){
          app.getActivityInfo(id, res => {
            let start_time = res.data.activity_start_time
            let end_time = res.data.activity_end_time
            let sign_up_ddl = res.data.activity_sign_up_ddl
            res.data.activity_start_time = new Date(start_time).toLocaleDateString()
            res.data.activity_end_time = new Date(end_time).toLocaleDateString()
            res.data.activity_sign_up_ddl = new Date(sign_up_ddl).toLocaleDateString()
            activityList[id] = res.data
            cnt1 += 1
            if(cnt1 == length && cnt2 == length){
              // console.log(activityList)
              _this.setData({
                activityList: activityList,
                pictureList: pictureList,
                data_loaded: true,
                recommendIds: _this.data.activityIds.slice(0, 6),
              })
            }
          })
          app.getActivityPictures(id, res => {
            if(res.data.status == '200 OK'){
              let pic_li = []
              for(let path of res.data.activity_pictures_list){
                pic_li.push(app.globalData.SERVER_ROOT_URL + path[1])
              }
              pictureList[id] = pic_li
              cnt2 += 1
              if(cnt1 == length && cnt2 == length){
                _this.setData({
                  activityList: activityList,
                  pictureList: pictureList,
                  data_loaded: true,
                  recommendIds: _this.data.activityIds.slice(0, 6),
                })
              }
            }
          })
        }
        Api.get_relations(relations => {
          _this.getJoinStatus(relations, _this)
        }, 'activity')
      }).catch(err => {
        console.log(err)
      })
    }
  },
  methods:{
    getJoinStatus: function(relations, _this) {
      let joined = []
      let due = []
      let cur_time = new Date().getTime()
      for(let activity_id of _this.data.activityIds)
      {
        let flag = false
        let finished = false
        if (relations[activity_id] !== undefined)
        {
          flag = true
        }
        if(new Date(_this.data.activityList[activity_id].activity_end_time).getTime() < cur_time)
        {
          finished = true
        }
        joined.push(flag)
        due.push(finished)
      }
      // console.log(joined)
      // console.log(_this.data.activityIds)
      _this.setData({
        activityJoined: joined,
        due: due,
        loaded: true
      })
    },
    tapActivity: function(e){
      let index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '/pages/activity/activity_detail/activity_detail?activity_id=' + this.data.activityIds[index]
      })
    },
    tapRecommend: function(e){
      let index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '/pages/activity/activity_detail/activity_detail?activity_id=' + this.data.recommendIds[index]
      })
    },
    tabSelect: function(e){
      this.setData({
        tabCur:e.currentTarget.dataset.list
      })
    },
    tapSearch: function(){
      
    },
    tapSignup: function(e){
      let _this = this
      let index = e.currentTarget.dataset.index
      let activity_id = this.data.activityIds[index]
      app.registerUserToActivity(app.globalData.openid, activity_id, res => {
        if(res.data.status == '200 OK'){
          wx.showToast({
            title: '报名活动成功',
          })
          console.log('register success', res.data.status)
          let new_status = _this.data.activityJoined
          new_status[index] = true
          _this.setData({
            activityJoined: new_status,
          })
        }
        else if(res.data.status == 'Rejected: User is not member of the club'){
          wx.showToast({
            title: '清先加入社团',
            image: '/images/fail.png'
          })
        }
      })
    }
  }
})