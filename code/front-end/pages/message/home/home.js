// pages/message/home/home.js
let app = getApp()
const api = app.require('utils/util.js');
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
    types: ['inform', 'reply', 'system'],
    read_flags: {},
    messageType: {
      inform_normal: '0',
      inform_managerInvite: '1',
      inform_presidentExchange: '2',
      reply_normal: '5',
      system_normal: '10',
    },
  },
  lifetimes: {
    ready: function(e){
      let _this = this
      let types = this.data.messageType
      let curPage = api.getCurPage()
      let unread_cnt = 0
      app.getMessages(res => {
        let send_message_list = res.data.send_message_list.reverse()
        let receive_message_list = res.data.receive_message_list.reverse()
        let messageList = {inform: {receive: [], send: []}, reply: {receive: [], send: []}, system: {receive: [], send: []}}
        let read_flags = {inform: {receive: [], send: []}, reply: {receive: [], send: []}, system: {receive: [], send: []}}
        for(let message of receive_message_list){
          let type = message[1]
          let content = JSON.parse(message[3])
          message[3] = content
          if(type == types.inform_normal || type == types.inform_managerInvite || type == types.inform_presidentExchange){
            messageList.inform.receive.push(message)
            if(message[3].read)
            {
              read_flags.inform.receive.push(1)
            }
            else{
              read_flags.inform.receive.push(0)
              unread_cnt += 1
            }
          }
          else if(type == types.system_normal){
            messageList.system.receive.push(message)
          }
        }
        
        for(let message of send_message_list){
          let type = message[1]
          let content = JSON.parse(message[3])
          message[3] = content
          if(type == types.inform_normal || type == types.inform_managerInvite || type == types.inform_presidentExchange){
            messageList.inform.send.push(message)
            read_flags.inform.send.push(1)
          }
        }
        _this.setData({
          messageList: messageList,
          read_flags: read_flags,
          loaded: true,
        })
        curPage.setData({
          unread_cnt: unread_cnt,
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
      // todo:这里加上将消息标记为已读
      let _this = this
      wx.showModal({
        title: messageList[index][2],
        content: messageList[index][3].info,
        confirmText: '我知道了',
        success: res => {
          if(res.confirm){
            if(_this.data.read_flags[tabCur][kind][index] == 0){
              let read_flags = _this.data.read_flags
              let curPage = api.getCurPage()
              read_flags[tabCur][kind][index] = 1
              _this.setData({
                read_flags: read_flags
              })
              curPage.setData({
                unread_cnt: curPage.data.unread_cnt - 1,
              })
            }
          }
        }
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
