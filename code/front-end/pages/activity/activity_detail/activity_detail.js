// pages/activity_detail/activity_detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {
      like:10,
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
    URL: 'https://81.70.150.127/gp10/',
    valid:undefined,
    sign_up_click:false,
    isClick:false,
    top_src:undefined,
    activity_List: undefined

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    _this.setData({activity_id:options.activity_id}),
    console.log(_this.data.activity_id),
    wx.request({
      url: app.globalData.SERVER_URL+'/getActivityInfo', 
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        activity_id:_this.data.activity_id
      },
      method:'POST',
      success: function(res) {
        res.data.activity_sign_up_ddl=new Date(res.data.activity_sign_up_ddl).toLocaleDateString(),
        res.data.activity_start_time=new Date(res.data.activity_start_time).toLocaleDateString(),
        res.data.activity_end_time=new Date(res.data.activity_end_time).toLocaleDateString(),
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
        app.getActivityCollectors(res.data.activity_id,res=>{
          console.log(res.data.activity_collector_list)
          if(res.data.status == '200 OK'){
            let temp=0
            for(let i of res.data.activity_collector_list){
              temp++
            }
            _this.setData({"activity.like":temp})
          } 
        })
        app.getActivityPictures(res.data.activity_id,res=>{
          if(res.data.status == '200 OK'){
            let pic = []
            for(let path of res.data.activity_pictures_list){
              pic.push(app.globalData.SERVER_ROOT_URL + path[1])
            }
            _this.setData({
              top_src:pic[0],
              activity_List:pic
            })
          }
        })
        app.getActivityListOfUser(app.globalData.openid,res=>{
          console.log(res)
          if(res.data.status == '200 OK'){
            for (let temp of res.data.registered_activity_list){
              if(temp[0]==_this.data.activity.id)
                _this.setData({
                  valid:true,
                  sign_up_click:true
                })
            }
            for (let temp of res.data.collected_activity_list){
              if(temp[0]==_this.data.activity.id)
                _this.setData({
                  isClick:true
                })
            }
          } 
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
   * 点击收藏
   */
  click_collect: function(){
    let that = this
    app.addCollectorToActivity(app.globalData.openid,that.data.activity_id,res=>{
      if(res.data.status == '200 OK'){
        that.setData({
          "isClick":true,
          "activity.like":that.data.activity.like+1
        })
        console.log('collect success', res.data.status)
      }
    })
  },
  click_cancel: function(){
    let that = this
    app.deleteCollectorFromActivity(app.globalData.openid,that.data.activity_id,res=>{
      if(res.data.status == '200 OK'){
        that.setData({
          "isClick":false,
          "activity.like":that.data.activity.like-1
        })
        console.log('cancel success', res.data.status)
      }
    })
  },

  sign_up: function(){
    let that = this
    app.registerUserToActivity(app.globalData.openid,that.data.activity_id,res=>{
      if(res.data.status == '200 OK'){
        that.setData({valid:true})
        console.log('register success', res.data.status)
        if(that.data.valid)
          that.setData({"sign_up_click":!that.data.sign_up_click})
      }
    })
  },
  
})