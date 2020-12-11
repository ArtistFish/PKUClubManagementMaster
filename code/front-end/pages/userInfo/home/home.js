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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo: function(event)
    {
      console.log(event)
      app.globalData.wxUuserInfo = event.detail.userInfo
      this.setData({
        wxUserInfo: event.detail.userInfo,
        hasUserInfo:true
      })
    },
    navigation: function(e){
      let cur = e.currentTarget.dataset.cur
      let url = '/pages/userInfo/' + cur + '/' + cur + '?obj='
      let option = undefined
      if(cur == 'clublist'){
        option = JSON.stringify(this.data.associated_club_id)
      }
      else if(cur == 'activitylist'){
        option = JSON.stringify(this.data.associated_activity_id)
      }
      else{
        option = JSON.stringify([this.data.associated_club_id, this.data.associated_activity_id])
      }
      url += option
      wx.navigateTo({
        url: url,
      })
    }
  },
  lifetimes:{
    attached:function(){
      if(app.globalData.wxUserInfo != null)
      {
        this.setData({
          hasUserInfo:true,
          wxUserInfo:app.globalData.wxUserInfo
        })
      }
      else
      {
        app.userInfoReadyCallback = res => {
          this.setData({
            hasUserInfo:true,
            wxUserInfo:res.userInfo
          })
        }
      }
    },
    ready: function(e){
      let _this = this
      app.refreshUserInfo(res => {
        let club_list = []
        let activity_list = []
        let collect_list = []
        club_list.push(...(res.data.associated_club_id.join))
        club_list.push(...(res.data.associated_club_id.setup))
        club_list = Array.from(new Set(club_list))
        activity_list.push(...(res.data.associated_activity_id.join))
        activity_list.push(...(res.data.associated_activity_id.setup))
        activity_list = Array.from(new Set(activity_list))
        collect_list.push(...(res.data.associated_club_id.star))
        collect_list.push(...(res.data.associated_activity_id.star))
        collect_list = Array.from(new Set(collect_list))
        let max = Math.max(club_list.length, activity_list.length, collect_list.length)
        max = Math.min(max, 20)
        let i = 0
        function func(){
          if(i < max){
            setTimeout(()=>{
              _this.setData({
                clubTotal: i,
                activityTotal: i,
                collectTotal: i,
              })
              i += 1
              func()
            }, 40)
          }
          else{
            _this.setData({
              clubTotal: club_list.length,
              activityTotal: activity_list.length,
              collectTotal: collect_list.length,
              associated_club_id: res.data.associated_club_id,
              associated_activity_id: res.data.associated_activity_id,
            })
          }
        }
        func()
      })
    }
  },
  options:{
    addGlobalClass: true
  }
})
