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
    }],
    recentList:[{
      name: 'zrfsb',
      introduce: 'zrfsb'
    }, {
      name: 'zrfsb',
      introduce: 'zrfsb'
    }],
    gridCol: 3,
    tabCur: 'all'
  },
  options:{
    addGlobalClass: true
  },
  methods:{
    tabSelect: function(e){
      this.setData({
        tabCur:e.currentTarget.dataset.list
      })
    },
    tapJoin: function(e){
      if(app.globalData.ourUserInfo.authorization == null){
        // let curPage = getCurrentPages().pop()
        wx.showModal({
          title: '您还未进行学生认证!',
          cancelText: '下次吧',
          confirmText: '马上去',
          success: function(res){
            if(res.confirm){
              // curPage.setData({
              //   CurPage: 'userInfo',
              // })
              wx.navigateTo({
                url: '/pages/userInfo/authorization/authorization',
              })
            }
          }
        })
      }
    }
  }
})