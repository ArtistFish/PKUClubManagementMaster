//app.js
App({
  require: function($url) {return require($url)},
  onLaunch: function() {
    let _this = this
    // 登录
    wx.getSystemInfo({
      success: e => {
        _this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          _this.globalData.Custom = capsule;
          _this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          _this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      },
    })
  },
  getClubPictures: function(club_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getClubPictures',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getClubPictures fail', res)
        }
        callback(res)
      }
    })
  },
  getActivityPictures: function(activity_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getActivityPictures',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        activity_id: activity_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getActivityPictures fail', res)
        }
        callback(res)
      }
    })
  },
  getOpenid: function(callback){
    let _this = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openid
        if(res.code){
          wx.request({
            // url: 'http://127.0.0.1:5000/gp10/getOpenid',
            url: this.globalData.SERVER_URL + '/getOpenid',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            data: {
              js_code: res.code
            },
            success: res => {
              if(res.data.status == '200 OK'){
                let obj = JSON.parse(res.data.openid)
                _this.globalData.openid = obj.openid
                console.log('get openid success', obj.openid)
                callback(res)
              }
              else{
                wx.showToast({
                  title: '获取信息失败',
                  image: '/images/fail.png',
                })
                console.log('getClubInfo fail', res)
              }
            },
            fail: res => {
              console.log(res)
            }
          })
        }
      }
    })
  },
  getClubInfo: function(club_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getClubInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getClubInfo fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getClubInfo api fail', res)
        callback(res)
      }
    })
  },
  getActivityInfo: function(activity_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getActivityInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        activity_id: activity_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getActivityInfo fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getActivityInfo api fail', res)
        callback(res)
      }
    })
  },
  addMemberToClub: function(club_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/addMemberToClub',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
        wx_id: this.globalData.openid,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('addMemberToClub fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('addMemberToClub api fail', res)
        callback(res)
      }
    })
  },
  getClubList: function(callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getClubList',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getClubList fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getClubList api fail', res)
        callback(res)
      }
    })
  },
  getUserInfo: function(wx_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getUserInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        wx_id: wx_id,
      },
      success: res => {
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getUserInfo api fail', res)
        // callback(res)
      }
    })
  },
  setUserInfo: function(user_name, avatarUrl, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/setUserInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        wx_id: this.globalData.openid,
        user_name: user_name,
        avatarUrl: avatarUrl,
      },
      success: res => {
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('setUserInfo api fail', res)
        // callback(res)
      }
    })
  },
  getActivityList: function(callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getActivityList',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getActivityList fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getActivityList api fail', res)
        callback(res)
      }
    })
  },
  getMessages: function(callback){
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
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getMessages fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getMessages api fail', res)
        callback(res)
      }
    })
  },
  createUser: function(wx_id, user_name, head_url, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/createUser',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        wx_id: wx_id,
        user_name: user_name,
        head_url: head_url,
      },
      method: 'POST',
      success: res => {
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('createClub api fail', res)
      }
    })
  },
  createClub: function(club_name, club_description, club_pircure_list=[], callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/createClub',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_name: club_name,
        club_description: club_description, 
        club_president_user_id: this.globalData.openid,
        club_picture_list: club_pircure_list
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('createClub fail', res)
        }
        callback(res)
      }, 
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('createClub api fail', res)
        callback(res)
      }
    })
  },
  createActivity: function(activity_name, activity_description, club_id, place, start_time, end_time, lottery_time, lottery_method, max_number, fee, sign_up_ddl, sponsor, undertaker, activity_picture_list = [], callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/createActivity',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        name: activity_name,
        description: activity_description,
        club_id: club_id,
        place: place,
        start_time: start_time,
        end_time: end_time,
        lottery_time: lottery_time,
        lottery_method: lottery_method,
        max_number: max_number,
        fee: fee,
        sign_up_ddl: sign_up_ddl,
        sponsor: sponsor,
        undertaker: undertaker,
        activity_picture_list: activity_picture_list
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('createActivity fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('createActivity api fail', res)
        callback(res)
      }
    })
  },
  deleteClub: function(club_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/deleteClub',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('deleteClub fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('deleteClub api fail', res)
        callback(res)
      }
    })
  },
  getClubManagers: function(club_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getClubManagers',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getClubManagers fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getClubManagers api fail', res)
        callback(res)
      }
    })
  },
  getClubMembers: function(club_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getClubMembers',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getClubMembers fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getClubMembers api fail', res)
        callback(res)
      }
    })
  },
  getClubActivities: function(club_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getClubActivities',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getClubActivities fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getClubActivities api fail', res)
        callback(res)
      }
    })
  },
  addManagerToClub: function(club_id, wx_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/addManagerToClub',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
        wx_id: wx_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('addManagerToClub fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('addManagerToClub api fail', res)
        callback(res)
      }
    })
  },
  addActivityToClub: function(club_id, activity_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/addActivityToClub',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
        activity_id: activity_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('addActivityToClub fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('addActivityToClub api fail', res)
        callback(res)
      }
    })
  },
  deleteManagerFromClub: function(club_id, wx_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/deleteManagerFromClub',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
        wx_id: wx_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('deleteManagerFromClub fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('deleteManagerFromClub api fail', res)
        callback(res)
      }
    })
  },
  deleteMemberFromClub: function(club_id, wx_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/deleteMemberFromClub',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
        wx_id: wx_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('deleteMemberFromClub fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('deleteMemberFromClub api fail', res)
        callback(res)
      }
    })
  },
  deleteActivityFromClub: function(club_id, activity_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/deleteActivityFromClub',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
        activity_id: activity_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('deleteActivityFromClub fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('deleteActivityFromClub api fail', res)
        callback(res)
      }
    })
  },
  setClubInfo: function(club_id, club_name, club_description, club_president_user_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/setClubInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
        club_name: club_name,
        club_description: club_description,
        club_president_user_id: club_president_user_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('setClubInfo fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('setClubInfo api fail', res)
        callback(res)
      }
    })
  },
  getRelatedClubList: function(keyword, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getRelatedClubList',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        keyword: keyword,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getRelatedClubList fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getRelatedClubList api fail', res)
        callback(res)
      }
    })
  },
  getClubCollectors: function(club_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getClubCollectors',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        club_id: club_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getClubCollectors fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getClubCollectors api fail', res)
        callback(res)
      }
    })
  },
  getClubListOfUser: function(wx_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getClubListOfUser',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        wx_id: wx_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getClubListOfUser fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getClubListOfUser api fail', res)
        callback(res)
      }
    })
  },
  getActivityListOfUser: function(wx_id, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/getActivityListOfUser',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        wx_id: wx_id,
      },
      method: 'POST',
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('getActivityListOfUser fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('getActivityListOfUser api fail', res)
        callback(res)
      }
    })
  },
  sendMessage: function(wx_id_sender, wx_id_receiver, type, title, content, callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/sendMessage',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wx_id_sender: wx_id_sender,
        wx_id_receiver: wx_id_receiver,
        type: type,
        title: title,
        content: content
      },
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '获取信息失败',
            image: '/images/fail.png',
          })
          console.log('sendMessage fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('sendMessage api fail', res)
        callback(res)
      }
    })
  },
  registerUserToActivity: function(wx_id, activity_id,callback){
    wx.request({
      url: this.globalData.SERVER_URL + '/registerUserToActivity',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wx_id: wx_id,
        activity_id:activity_id
      },
      success: res => {
        if(res.data.status != '200 OK'){
          wx.showToast({
            title: '没有加入社团',
            image: '/images/fail.png',
          })
          console.log('register fail', res)
        }
        callback(res)
      },
      fail: res =>{
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('registerUserToActivity api fail', res)
        callback(res)
      }
    })
  },
  updatePicture: function(filePath, callback){
    wx.uploadFile({
      filePath: filePath,
      name: 'filename',
      url: this.globalData.SERVER_URL + '/updatePicture',
      success: res => {
        callback(res)
      }
    })
  },
  globalData: {
    messageType: {
      inform_normal: 0,
      inform_managerInvite: 1,
      inform_presidentExchange: 2
    },
    userInfo: null,
    userIsManager: false,
    userIsPresident: true,
    userIsMember: false,
    userName: "zrf",
    wxUserInfo: null,
    openid: null,
    ourUserInfo: {},
    clubList: [],
    activityList: [],
    messageList: [],
    SERVER_URL: 'https://thunderclub.xyz/gp10',
    SERVER_ROOT_URL: 'https://thunderclub.xyz',
    current_club: {
      id: undefined, 
      club_name: undefined, 
      club_description: undefined,
      class_tag: undefined, 
      cover_pircure: undefined, 
      display_pictures: [], 
      discription: undefined, 
      associated_activities: [], 
      contact_QR: undefined, 
      fee: undefined, 
      club_president_id: undefined, 
      club_manager_list: [], 
      club_member_list: [], 
      relation: undefined,
      collector_id: []
    },
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