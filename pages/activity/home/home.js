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
    activity_list: [1],
  },
  options:{
    addGlobalClass: true
  },
  lifetimes:{
    ready: function(e){
      let _this = this
      let activity_ids = app.globalData.activityList
      let cnt = 0
      let length = activity_ids.length
      let activity_list = []
      if(length == 0){
        _this.setData({
          loaded: true
        })
      }
      for(let activity_id of activity_ids){
        wx.request({
          url: app.globalData.SERVER_URL + '/getActivityInfo',
          header: {
            'content-type': 'application/x-www-form-urlencoded' //修改此处即可
          },
          method: 'POST',
          data: {
            activity_id: activity_id
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