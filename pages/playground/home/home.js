let app = getApp()
Component({
  data: {
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
    clubList: [],
    recentList:[],
    gridCol: 3,
    tabCur: 'all',
    loaded: false,
  },
  lifetimes:{
    ready: function(){
      let _this = this
      let club_ids = app.globalData.clubList
      let clubList = []
      let cnt = 0
      let length = club_ids.length
      for(let id of club_ids){
        wx.request({
          url: app.globalData.SERVER_URL + '/getClubInfo?club_id=' + id,
          data:{
            club_id: id,
          },
          method: 'POST',
          success: (res) => {
            cnt += 1
            clubList.push(res.data)
            if(cnt == length)
            {
              _this.setData({
                clubList: clubList,
                loaded: true,
              })
            }
          }
        })
      }
    }
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
      if(app.globalData.personel.authorization.is_authorized == false){
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