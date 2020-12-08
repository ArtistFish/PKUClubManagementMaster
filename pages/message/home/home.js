// pages/message/home/home.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tabCur: 'inform',
    messageList: {inform: [{title: '成功加入社团通知', content: '您已经成功加入北京大学徒步协会'}, {title: '职责变更通知', content: '您已经成功担任北京大学徒步协会会长'}], reply: [], system: []},
    informTitle: ['社团信息通知', '活动信息通知', '职责变更通知'],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapMessage: function(e){
      let tabCur = this.data.tabCur
      let index = e.currentTarget.dataset.index
      let messageList = this.data.messageList[tabCur]
      wx.showModal({
        title: messageList[index].title,
        content: messageList[index].content,
        confirmText: '我知道了',
      })
    },
    tabSelect: function(e)
    {
      this.setData({
        tabCur:e.currentTarget.dataset.list
      })
    },
    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX
      })
    },
    ListTouchMove(e) {
      this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
      })
    },
  
    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.data.ListTouchDirection =='left'){
        this.setData({
          modalName: e.currentTarget.dataset.index
        })
      } else {
        this.setData({
          modalName: null
        })
      }
      this.setData({
        ListTouchDirection: null
      })
    },
  },
  options:{
    addGlobalClass: true
  }
})
