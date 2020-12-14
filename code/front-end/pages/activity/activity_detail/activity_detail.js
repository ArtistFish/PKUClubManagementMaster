// pages/activity_detail/activity_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {
      id: undefined, 
      name: "2020北京大学秋季第一次滑雪活动",
      associated_club_id: undefined, 
      cover_picture: undefined, 
      display_pictures: [], 
      sign_up_ddl: "2020 10 09", 
      lottery_result_time: undefined, 
      begin_time: "2020 09 10", 
      end_time: "2020 09 11", 
      sign_up_id: [], 
      selected_id: [], 
      collector_id: [], 
      fee: 145.0, 
      lottery_method: undefined,
      description:"本次活动由化学社团承办，报名时间为2019 10 09，活动时间为2020 10 10",
      sponsor:"北京大学滑雪社",
      undertaker:"滑雪场"
    },
    URL: 'http://47.92.240.179:5000/gp10',
    valid:false,
    sign_up_click:false,
    isClick:false,
    top_src:"/images/share.jpg",
    activity_List: [{
      url:"/images/share.jpg"
      }, {
      url:"/images/share.jpg"
      },{
      url:"/images/componentBg.png"
      },{
      url:"/images/logo.png"
      },{
      url:"/images/logo.png"
      }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
   // _this.setData({activity_id:options.activity_id}),
    _this.setData({activity_id:options.activity_id}),
    console.log(_this.data.activity_id),
    wx.request({
      url: 'http://47.92.240.179:5000/gp10/getActivityInfo', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        activity_id:_this.data.activity_id
      },
      method:'POST',
      success: function(res) {
        console.log(res),
        _this.setData({
          "activity.fee":res.data.activity_fee,
          "activity.id": res.data.activity_id, 
          "activity.name": res.data.activity_name,
          "activity.sign_up_ddl": res.data.activity_sign_up_ddl,  
          "activity.begin_time":res.data.activity_start_time, 
          "activity.end_time": res.data.activity_end_time, 
          "activity.description":res.data.activity_description,
          "activity.sponsor":res.data.activity_sponsor,
          "activity.undertaker":res.data.activity_undertaker
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  /**
   * 点击报名
   */
  click: function(){
    var s = this.data.isClick
    this.setData({isClick:!s})
  },

  sign_up: function(){
    var s = this.data.sign_up_click
    if(this.data.valid)
      this.setData({sign_up_click:!s})
    else  
    wx.showToast({
      title: '请先加入社团',
      icon: 'loading',
      duration: 1500
    })
  },
})