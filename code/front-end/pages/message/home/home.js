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
            if(message[3].read)
            {
              read_flags.system.receive.push(1)
            }
            else{
              read_flags.system.receive.push(0)
              unread_cnt += 1
            }
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
    tapResponse: function(e){
      let tabCur = this.data.tabCur
      let kind = e.currentTarget.dataset.kind
      let index = e.currentTarget.dataset.index
      let message = this.data.messageList[tabCur][kind][index]
      let content = '是否要接受会长移交？'
      if(message[1] == this.data.messageType.inform_managerInvite){
        content = '是否要接受管理员任命?'
      }
      wx.showModal({
        title: '职务变动回应',
        content: content,
        success: res => {
          if(res.confirm){
            if(message[1] == this.data.messageType.inform_managerInvite){
              app.addManagerToClub(message[3].club_id, app.globalData.openid, res => {
                if(res.data.status == '200 OK'){
                  wx.showToast({
                    title: '成功接受任命',

                  })
                }
                else if(res.data.status == 'Already in the club! failed!'){
                  wx.showToast({
                    title: '请勿重复接受邀请',
                    icon: 'none'
                  })
                }
                console.log(res.data)
              })
            }
            else if(message[1] == this.data.messageType.inform_presidentExchange){
              new Promise((resolve, reject) => {
                app.getClubInfo(message[3].club_id, res => {
                  if(res.data.status == '200 OK'){
                    resolve(res.data)
                  }
                })
              }).then(club_info => {
                app.setClubInfo(club_info.club_id, club_info.club_name, club_info.club_description, app.globalData.openid, res => {
                  if(res.data.status == '200 OK'){
                    if(res.data.status == '200 OK'){
                      wx.showToast({
                        title: '成功接受任命',
                      })
                    }
                  }
                })
              })
            }
          }
        }
      })
    },
    tapMessage: function(e){
      let tabCur = this.data.tabCur
      let kind = e.currentTarget.dataset.kind
      let index = e.currentTarget.dataset.index
      let message = this.data.messageList[tabCur][kind][index]
      // todo:这里加上将消息标记为已读
      let _this = this
      wx.showModal({
        title: message[2],
        content: message[3].info,
        confirmText: '我知道了',
        success: res => {
          if(res.confirm){
            if(_this.data.read_flags[tabCur][kind][index] == 0){
              message[3].read = true
              let read_flags = _this.data.read_flags
              let curPage = api.getCurPage()
              app.setMessageInfo(message[0], message[1], message[2], JSON.stringify(message[3]), message[4], message[5], res => {
                console.log(res.data)
              })
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
