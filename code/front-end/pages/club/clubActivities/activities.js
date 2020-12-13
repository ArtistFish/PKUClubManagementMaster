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
        let activityList = []
        let cnt = 0
        let length = activity_list.length
        if(length == 0){
          _this.setData({
            loaded: true,
          })
        }
        for(let activity of activity_list){
          let id = activity[0]
          app.getActivityInfo(id, res => {
            cnt += 1
            activityList.push(res.data)
            if(cnt == length){
              _this.setData({
                activityList: activityList,
                loaded: true,
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

  }
})
