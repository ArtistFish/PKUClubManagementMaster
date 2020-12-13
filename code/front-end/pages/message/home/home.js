// pages/message/home/home.js
let app = getApp()
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
    messageList: {},
    informTitle: {},
  },
  lifetimes: {
    ready: function(e){
      let _this = this
      app.getMessages(res => {
        let send_message_list = res.data.send_message_list
        let receive_message_list = res.data.receive_message_list
        let messageList = {inform: {receive: [], send: []}, reply: {receive: [], send: []}, system: {receive: [], send: []}}
        for(let message of receive_message_list){
          messageList[message.type].receive.push(message)
        }
        for(let message of send_message_list){
          messageList[message.type].send.push(message)
        }
        _this.setData({
          messageList: messageList,
          loaded: true,
        })
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tapMessage: function(e){
      let tabCur = this.data.tabCur
      let kind = e.currentTarget.dataset.kind
      let index = e.currentTarget.dataset.index
      let messageList = this.data.messageList[tabCur][kind]
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
  },
  options:{
    addGlobalClass: true
  }
})
