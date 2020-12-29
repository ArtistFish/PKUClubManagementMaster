// pages/userInfo/home/home.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  data: {
    hasUserInfo:false,
    wxUserInfo:null,
    clubTotal: 0,
    activityTotal: 0,
    collectTotal: 0,
    loaded: false,
    userInfo: {name: undefined, avatarUrl: undefined}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapAvatar: function(e){
      wx.navigateTo({
        url: '/pages/userInfo/selfie/selfie?wx_id=' + app.globalData.openid,
      })
    },
    navigation: function(e){
      let cur = e.currentTarget.dataset.cur
      let url = '/pages/userInfo/' + cur + '/' + cur
      let option = undefined
      if(cur == 'clublist'){
        option = '?obj=' + JSON.stringify(this.data.associated_club_id)
      }
      else if(cur == 'activitylist'){
        option = '?obj=' + JSON.stringify(this.data.associated_activity_id)
      }
      else if(cur == 'starlist'){
        option = '?obj=' + JSON.stringify([this.data.associated_club_id, this.data.associated_activity_id])
      }
      else{
        option = ''
      }
      url += option
      wx.navigateTo({
        url: url,
      })
    }
  },
  lifetimes:{
    ready: function(e){
      let _this = this
      app.getUserInfo(app.globalData.openid, res => {
        if(res.data.status == '200 OK'){
          _this.setData({
            hasUserInfo: true,
            userInfo:{
              name: res.data.user_name,
              avatarUrl: res.data.head_url
            }
          })
          app.globalData.ourUserInfo = _this.data.userInfo
        }
      })
      let load_cnt = 0
      let associated_club_id = {join: [], setup: [], collector: []}
      let associated_activity_id = {registered: [], selected: []}
      app.getClubListOfUser(app.globalData.openid, res => {
        // console.log(res)
        let president_club_list = res.data.president_club_list
        let manager_club_list = res.data.manager_club_list
        let member_club_list = res.data.member_club_list
        let collector_club_list = res.data.collector_club_list
        for(let club of president_club_list){
          let id = club[0]
          associated_club_id.setup.push(id)
        }
        for(let club of manager_club_list){
          let id = club[0]
          associated_club_id.join.push(id)
        }
        for(let club of member_club_list){
          let id = club[0]
          associated_club_id.join.push(id)
        }
        for(let club of collector_club_list){
          let id = club[0]
          associated_club_id.collector.push(id)
        }
        associated_club_id.join = Array.from(new Set(associated_club_id.join))
        let i = 0
        let total = associated_club_id.setup.length + associated_club_id.join.length
        function func(){
          if(i < total){
            setTimeout(() => {
              _this.setData({
                clubTotal: i
              })
              i += 1
              func()
            }, 30)
          }
          else{
            _this.setData({
              clubTotal: total,
              collectTotal: collector_club_list.length,
            })
          }
        }
        func()
        load_cnt += 1
        if(load_cnt == 2){
          _this.setData({
            associated_club_id: associated_club_id,
            associated_activity_id, associated_activity_id,
            loaded: true,
          })
        }
      })
      app.getActivityListOfUser(app.globalData.openid, res => {
        // console.log(res)
        let registered_activity_list = res.data.registered_activity_list
        let selected_activity_list = res.data.selected_activity_list
        for(let activity of registered_activity_list){
          let id = activity[0]
          associated_activity_id.registered.push(id)
        }
        for(let activity of selected_activity_list){
          let id = activity[0]
          associated_activity_id.selected.push(id)
        }
        let temp = associated_activity_id.registered
        temp.push(...associated_activity_id.selected)
        temp = Array.from(new Set(temp))
        let i = 0
        let total = temp.length
        let _this = this
        function func(){
          if(i < total){
            setTimeout(() => {
              _this.setData({
                activityTotal: i
              })
              i += 1
              func()
            }, 30)
          }
          else{
            _this.setData({
              activityTotal: total
            })
          }
        }
        func()
        load_cnt += 1
        if(load_cnt == 2){
          _this.setData({
            associated_club_id: associated_club_id,
            associated_activity_id, associated_activity_id,
            loaded: true,
          })
        }
      })
    }
  },
  options:{
    addGlobalClass: true
  }
})
