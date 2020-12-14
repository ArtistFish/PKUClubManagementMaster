// pages/clubActivities/activities.js
let app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes:{
    ready: function(){
      let _this = this
      new Promise((resolve, reject) => {
        app.getClubActivities(app.globalData.current_club.club_id, res => {
          if(res.data.status != '200 OK'){
            reject(res)
          }
          else
            resolve(res.data.club_activity_list)
      })
      }).then(activity_list => {
        let activityIds = []
        let activityList = []
        let cnt = 0
        let length = activity_list.length
        if(length == 0){
          _this.setData({
            loaded: true,
          })
        }
        for(let activity of activity_list){
          let id = activity[1]
          activityIds.push(id)
          app.getActivityInfo(id, res => {
            cnt += 1
            console.log(res.data)
            let start_time = res.data.activity_start_time
            let end_time = res.data.activity_end_time
            let sign_up_ddl = res.data.activity_sign_up_ddl
            res.data.activity_start_time = new Date(start_time).toLocaleDateString()
            res.data.activity_end_time = new Date(end_time).toLocaleDateString()
            res.data.activity_sign_up_ddl = new Date(sign_up_ddl).toLocaleDateString()
            activityList.push(res.data)
            if(cnt == length){
              _this.setData({
                activityList: activityList,
                loaded: true,
                activityIds: activityIds,
              })
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    clubList:[{
      name: 'zrfsb',
      introduce: 'zrfsb'
    }, {
      name: 'zrfsb',
      introduce: 'zrfsb'
    }, {
      name: 'zrfsb',
      introduce: 'zrfsb'
    }, {
      name: 'zrfsb',
      introduce: 'zrfsb'
    }, {
      name: 'zrfsb',
      introduce: 'zrfsb'
    }, {
      name: 'zrfsb',
      introduce: 'zrfsb'
    }, {
      name: 'zrfsb',
      introduce: 'zrfsb'
    }],
    userIsPresident: app.globalData.userIsPresident,
    userIsManager: app.globalData.userIsManager,
    userName: app.globalData.userName
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapActivity: function(e){
      let index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '/pages/activity/activity_detail/activity_detail?activity_id=' + this.data.activityIds[index],
      })
    },
    createActivity(){
      wx.navigateTo({
        url: '/pages/activity/createActivity/createActivity?club_id=' + app.globalData.current_club.club_id,
      })
    }
  }
})
