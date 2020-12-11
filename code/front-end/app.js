//app.js
App({
  onLaunch: function() {
    let _this = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
        console.log('login success', res)
        if(res.code){
          // 上面这个是我自己的小程序id
          let appid = 'wxb668543108717363'
          let secret = 'c1b9e0873c7dd1cf79553828484e1b89'
          // 下面是测试号
          // let appid = 'wx15b48d32c8913d2c'
          // let secret = '266dbde1825c159269bbaaf61821484a'
          let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code'
          wx.request({
            url: url,
            method: 'GET',
            success: function(res)
            {
              _this.globalData.openid = res.data.openid
              console.log('get openid success', res.data.openid)
              // console.log(res)
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.wxUserInfo = res.userInfo
              console.log('get userinfo success', res.userInfo)
              // console.log(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
            this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      },
    })
    wx.request({
      url: this.globalData.SERVER_URL + '/getClubList',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '拉取社团列表失败'
          })
        }
        else
        {
          console.log('get clublist success', res.data.club_list)
        }
        _this.globalData.clubList = res.data.club_list
      },
      fail: res => {
        console.log(res)
        wx.showToast({
          title: '拉取社团列表失败',
        })
      }
    })
    wx.request({
      url: this.globalData.SERVER_URL + '/getActivityList',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '拉取活动列表失败',
            image: '/images/fail.png',
          })
        }
        else
        {
          console.log('get activity list success', res.data.activity_list)
        }
        _this.globalData.activityList = res.data.activity_list
      },
      fail: res => {
        console.log(res)
        wx.showToast({
          title: '拉取社团列表失败',
          image: '/images/fail.png',
        })
      }
    })
    wx.request({
      url: this.globalData.SERVER_URL + '/getMessages',
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '拉取信息列表失败',
            image: '/images/fail.png',
          })
        }
        else
        {
          console.log('get messagelist success')
          _this.globalData.mseeageList = [res.data.send_message_list, res.data.receive_message_list]
        }
      },
      fail: res => {
        console.log(res)
        wx.showToast({
          title: '拉取信息列表失败',
          image: '/images/fail.png',
        })
      }
    })
  },
  refreshClubList: function(callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getClubList',
      success: res => {
        callback(res)
      },
      fail: res => {
        callback(res)
      }
    })
  },
  refreshUserInfo: function(callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getUserInfo',
      success: res => {
        callback(res)
      },
      fail: res => {
        callback(res)
      }
    })
  },
  refreshActivityList: function(callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getActivityList',
      success: res => {
        callback(res)
      },
      fail: res => {
        callback(res)
      }
    })
  },
  refreshMessageList: function(callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getMessages',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wx_id: this.globalData.openid,
      },
      success: res => {
        callback(res)
      },
      fail: res => {
        callback(res)
      }
    })
  },
  globalData: {
    wxUserInfo: null,
    openid: null,
    // ourUserInfo: {authorization:{school: 'PKU', name: 'zrf', sex: '女', 'ID': '1700012823', major: '信息科学技术学院'}},
    ourUserInfo: {},
    clubList: [],
    activityList: [],
    messageList: [],
    SERVER_URL: 'http://47.92.240.179:5000/gp10',
    club: {
      id: undefined, 
      name: undefined, 
      class_tag: undefined, 
      cover_pircure: undefined, 
      display_pictures: [], 
      discription: undefined, 
      associated_activities: [], 
      contact_QR: undefined, 
      fee: undefined, 
      president_id: undefined, 
      manager_id: [], 
      member_id: [], 
      collector_id: []
    },
    activity: {
      id: undefined, 
      name: undefined,
      associated_club_id: undefined, 
      cover_picture: undefined, 
      display_pictures: [], 
      sign_up_ddl: undefined, 
      lottery_result_time: undefined, 
      begin_time: undefined, 
      end_time: undefined, 
      sign_up_id: [], 
      selected_id: [], 
      collector_id: [], 
      fee: undefined, 
      lottery_method: undefined
    },
    personel: {
      id: undefined, 
      age: undefined, 
      sex: undefined, 
      authorization: {
        is_authorized: true, 
        major: undefined, 
        student_id: undefined
      }, 
      associated_club_id: {
        join: [],
        setup: [], 
        manage: [], 
        star: []
      }, 
      associated_activity_id: {
        join: [], 
        setup: [], 
        star: []
      }, 
      associated_message_id: []
    },
  }
})