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
    activityIds: [],
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
          else
            resolve(res.data.activity_list)
      })
      }).then(activity_list => {
        let activityIds = []
        let activityList = []
        let cnt = 0
        let length = activity_list.length
        if(length == 0){
          _this.setData({
            // loaded: true,
          })
        }
        for(let activity of activity_list){
          let id = activity[0]
          app.getActivityInfo(id, res => {
            cnt += 1
            let start_time = res.data.activity_start_time
            let end_time = res.data.activity_end_time
            let sign_up_ddl = res.data.activity_sign_up_ddl
            res.data.activity_start_time = new Date(start_time).toLocaleDateString()
            res.data.activity_end_time = new Date(end_time).toLocaleDateString()
            res.data.activity_sign_up_ddl = new Date(sign_up_ddl).toLocaleDateString()
            activityList.push(res.data)
            activityIds.push(id)
            if(cnt == length){
              _this.setData({
                activityList: activityList,
                // loaded: true,
                activityIds: activityIds,
                recommendIds: activityIds.slice(0, 6),
                recommendList: activityList.slice(0, 6),
              })
            }
          })
        }
      }).then(
        () => {
          Api.get_relations(relations => {
            _this.getJoinStatus(relations, _this)
          }, 'activity')
        }
      ).catch(err => {
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
        if (relations[activity_id] !== undefined)
        {
          flag = true
        }
        joined.push(flag)
      }
      for(let activity of _this.data.activityList){
        if(new Date(activity.activity_end_time).getTime() < cur_time){
          due.push(true)
        }
        else{
          due.push(false)
        }
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
    tapSignup: function(e){
      console.log(e)
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