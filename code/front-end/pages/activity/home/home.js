let app = getApp()
Component({
  data: {
    array:[
      {
        name: 'index',
        title: '空间',
        color: 'blue',
        icon: 'camerafill'
      },
      {
        name: 'index',
        title: '聊天',
        color: 'red',
        icon: 'camerafill'
      },
      {
        name: 'index',
        title: '游戏',
        color: 'yellow',
        icon: 'camerafill'
      }
    ],
    iconList: [{
      icon: 'cardboardfill',
      color: 'red',
    }, {
      icon: 'recordfill',
      color: 'orange',
    }, {
      icon: 'picfill',
      color: 'yellow',
    }, {
      icon: 'noticefill',
      color: 'olive',
    }, {
      icon: 'upstagefill',
      color: 'cyan',
    }, {
      icon: 'clothesfill',
      color: 'blue',
    }, {
      icon: 'discoverfill',
      color: 'purple',
    }, {
      icon: 'questionfill',
      color: 'mauve',
    }, {
      icon: 'commandfill',
      color: 'purple',
    }, {
      icon: 'brandfill',
      color: 'mauve',
    }],
    gridCol: 2,
    tabCur: 'all',
    loaded: false,
    activity_list: [],
  },
  options:{
    addGlobalClass: true
  },
  lifetimes:{
    ready: function(e){
      let _this = this
      app.refreshActivityList(res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
        }
        else{
          let activities = res.data.activity_list
          console.log(activities)
          let cnt = 0
          let length = activities.length
          let activity_list = []
          if(length == 0){
            _this.setData({
              loaded: true
            })
          }
          for(let activity of activities){
            let id = activity[0]
            wx.request({
              url: app.globalData.SERVER_URL + '/getActivityInfo',
              header: {
                'content-type': 'application/x-www-form-urlencoded' //修改此处即可
              },
              method: 'POST',
              data: {
                activity_id: id
              },
              success: res => {
                if(res.data.status == '200 OK'){
                  activity_list.push(res.data.activity_info)
                  cnt += 1
                  if(cnt == length){
                    _this.setData({
                      loaded: true,
                      activity_list: activity_list,
                    })
                  }
                }
                else{
                  console.log('get activity info fail', res)
                }
              },
              fail: res => {
                console.log('get activity info fail', res)
              }
            })
          }
        }
      })
    }
  },
  methods:{
    tapActivity: function(e){
      let index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '/pages/activity/detail/detail?activity_id=' + app.globalData.activityList[index]
      })
    },
    tabSelect: function(e){
      this.setData({
        tabCur:e.currentTarget.dataset.list
      })
    },
    tapSignup: function(e){
      console.log(e)
    }
  }
})