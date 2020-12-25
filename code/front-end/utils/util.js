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
  _this.setData({
    userIsPresident: app.globalData.userIsPresident,
    userIsManager: app.globalData.userIsManager,
    userIsMember: app.globalData.userIsMember,
    userName: app.globalData.openid.slice(-5),
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
}
