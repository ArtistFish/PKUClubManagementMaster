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
            loaded: true,
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
  methods:{
    tapActivity: function(e){
      let index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '/pages/activity/activity_detail/activity_detail?activity_id=' + this.data.activityIds[index]
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
      
    }
  }
})