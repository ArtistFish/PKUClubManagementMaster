// pages/clubActivities/activities.js
const app = getApp();
const Api = app.require('utils/util.js');
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
    attached: function () {
      Api.set_current_user(this)
      console.log(this.data)
    },
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
        for(let activity of activity_list){
          activityIds.push(activity[1])
        }
        _this.setData({
          activityIds: activityIds,
        })
        let activityList = {}
        let pictureList = {}
        let cnt1 = 0
        let cnt2 = 0
        let length = activity_list.length
        if(length == 0){
          _this.setData({
            loaded: true,
          })
        }
        for(let id of _this.data.activityIds){
          app.getActivityInfo(id, res => {
            // console.log(res.data)
            let start_time = res.data.activity_start_time
            let end_time = res.data.activity_end_time
            let sign_up_ddl = res.data.activity_sign_up_ddl
            res.data.activity_start_time = new Date(start_time).toLocaleDateString()
            res.data.activity_end_time = new Date(end_time).toLocaleDateString()
            res.data.activity_sign_up_ddl = new Date(sign_up_ddl).toLocaleDateString()
            activityList[id] = res.data
            cnt1 += 1
            if(cnt1 == length && cnt2 == length){
              _this.setData({
                activityList: activityList,
                pictureList: pictureList,
                loaded: true,
              })
            }
          })
          app.getActivityPictures(id, res => {
            if(res.data.status == '200 OK'){
              cnt2 += 1
              let pic_li = []
              for(let path of res.data.activity_pictures_list){
                pic_li.push(app.globalData.SERVER_ROOT_URL + path[1])
              }
              pictureList[id] = pic_li
              if(cnt1 == length && cnt2 == length){
                _this.setData({
                  activityList: activityList,
                  pictureList: pictureList,
                  loaded: true
                })
              }
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
