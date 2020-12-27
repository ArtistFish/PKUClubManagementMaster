const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

let requestHandler = {
  url: '',
  data: {},
  method: '',
  success: function (res) {
  },
  fail: function () {
  },
  complete: function () {
  }
}
 
function request(requestHandler) {
  let data = requestHandler.data;
  let url = requestHandler.url;
  let method = requestHandler.method;
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: url,
    data: data,
    method: method,
    success: function (res) {
      wx.hideLoading();
      requestHandler.success(res)
    },
    fail: function () {
      wx.hideLoading();
      requestHandler.fail();
    },
    complete: function () {
       
    }
  })
}
function set_current_user(_this)
{
  let app = getApp()
  let relation = app.globalData.current_club.relation
  _this.setData({
    userIsPresident: relation === 'president',
    userIsManager: relation === 'manager',
    userIsMember: relation === 'member',
    userName: app.globalData.openid.slice(-5),
  })
}
function join_club(club_id, callback){
  let app = getApp()
  if(app.globalData.personel.authorization.is_authorized == false){
    wx.showModal({
      title: '您还未进行学生认证!',
      cancelText: '下次吧',
      confirmText: '马上去',
      success: function(res){
        if(res.confirm){
          wx.navigateTo({
            url: '/pages/userInfo/authorization/authorization',
          })
        }
      }
    })
  }
  else{
    app.addMemberToClub(club_id, res => {
      if(res.data.status != '200 OK'){
        wx.showToast({
          title: '加入社团失败',
          image: '/images/fail.png',
        })
      }
      else{
        wx.showToast({
          title: '加入社团成功',
        })
        getRelations(callback)
      }
    })
  }
}
// 判断该user和社团的关系
function getRelations(callback, target='club') {
  let app = getApp()
  let user_id = app.globalData.openid
  if(target == 'club'){
    app.getClubListOfUser(user_id, res=>{
      if(res.data.status != '200 OK')
      {
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('获取个人所在社团信息失败')
        return 
      }
      let relations = {}
      for (let joined_club of res.data.president_club_list)
      {
        let joined_club_id = joined_club[0]
        relations[joined_club_id] = 'president'
      }
      for (let joined_club of res.data.manager_club_list)
      {
        let joined_club_id = joined_club[0]
        relations[joined_club_id] = 'manager'
      }
      for (let joined_club of res.data.member_club_list)
      {
        let joined_club_id = joined_club[0]
        relations[joined_club_id] = 'member'
      }
      app.globalData.relations = relations
      callback(relations)
    })
  }
  else if(target == 'activity'){
    app.getActivityListOfUser(user_id, res=>{
      if(res.data.status != '200 OK')
      {
        wx.showToast({
          title: '获取信息失败',
          image: '/images/fail.png',
        })
        console.log('获取个人所在社团信息失败')
        return 
      }
      let relations = {}
      for (let registered_activity of res.data.registered_activity_list)
      {
        let registered_activity_id = registered_activity[0]
        relations[registered_activity_id] = 'registered'
      }
      for (let selected_activity of res.data.selected_activity_list)
      {
        let selected_activity_id = selected_activity[0]
        relations[selected_activity_id] = 'selected'
      }
      // app.globalData.relations = relations
      callback(relations)
    })
  }
}
function quitClub(club_id, callback) {
  let app = getApp()
  let relation = app.globalData.relations[club_id]
  if (relation !== 'member')
  {
    wx.showModal({
      title: '退出社团失败',
      content: '您目前是社团管理员，请先移交管理权限',
      cancelText: '下次吧',
      confirmText: '马上去',
      success: function(res){
        if(res.confirm){
          wx.navigateTo({
            url: `/pages/club/frontpage/frontpage?tab=3&club_id=${club_id}`,
          })
        }
      }
    })
    return
  }
  wx.showModal({
    title: '确定要退出社团？',
    cancelColor: 'cancelColor',
    success: ()=>{
      app.deleteMemberFromClub(club_id, app.globalData.openid,
        res=>{
          if(res.data.status != '200 OK')
          {
            wx.showToast({
              title: '退出社团失败',
              image: '/images/fail.png',
            })
          }
          else
          {
            wx.showToast({
              title: '退出社团成功',
            })
            getRelations(callback)
          }
        }
      )
    }
  })
}
function getCurPage(){
  let pages = getCurrentPages()
  return pages[pages.length - 1]
}
module.exports = {
  formatTime: formatTime,
  request: request,
  set_current_user: set_current_user,
  getCurPage: getCurPage,
  join_club: join_club,
  get_relations: getRelations,
  quit_club: quitClub
}
