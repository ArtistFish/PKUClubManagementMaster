// pages/userInfo/authorization/authorization.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sponsor: 'xx',
    undertaker: 'xx',
    coverImgList: [],
    contactImgList: [],
    displayImgList: [],
    name: undefined,
    description: undefined,
  },
  ChooseImage(e) {
    let count = undefined
    let imgList = []
    let target = e.currentTarget.dataset.cur
    if(target == 'display'){
      count = 9
      imgList = this.data.displayImgList
    }
    else if(target == 'cover'){
      count = 1
      imgList = this.data.coverImgList
    }
    else{
      count = 1
      imgList = this.data.contactImgList
    }
    wx.chooseImage({
      count: count, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (imgList.length != 0) {
          this.setData({
            [target + 'ImgList']: imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            [target + 'ImgList']: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    let cur = e.currentTarget.dataset.cur
    let imgList = []
    if(cur == 'display'){
      imgList = this.data.displayImgList
    }
    else if(cur == 'cover'){
      imgList = this.data.coverImgList
    }
    else{
      imgList = this.data.contactImgList
    }
    wx.previewImage({
      urls: imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    let cur = e.currentTarget.dataset.cur
    let imgList = []
    let index = e.currentTarget.dataset.index
    if(cur == 'display'){
      imgList = this.data.displayImgList
    }
    else if(cur == 'cover'){
      imgList = this.data.coverImgList
    }
    else{
      imgList = this.data.contactImgList
    }
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          imgList.splice(index, 1);
          this.setData({
            [cur + 'ImgList']: imgList
          })
        }
      }
    })
  },
  editInput: function(e){
    this.setData({
      [e.currentTarget.dataset.cur]: e.detail.value,
    })
  },
  tapCommit: function(){
    console.log({
      name: this.data.name,
      description:this.data.description,
      club_id: this.data.club_id,
      place: this.data.place,
      start_time: this.data.start_time,
      end_time: this.data.end_time,
      sign_up_ddl: this.data.sign_up_ddl,
      lottery_time: this.data.lottery_time,
      lottery_method: this.data.lottery_method,
      coverImg: this.data.coverImgList,
      contactImg: this.data.coverImgList,
      displayImgList: this.data.displayImgList,
    })
    wx.showLoading({
      title: '创建中',
    })
    app.createActivity(this.data.name, this.data.description, this.data.club_id, this.data.place, this.data.start_time, this.data.end_time, this.data.lottery_time, this.data.lottery_method, this.data.max_number, this.data.fee, this.data.sign_up_ddl, this.data.sponsor, this.data.undertaker, res => {
      if(res.data.status != '200 OK'){
        wx.showToast({
          title: '发布活动失败',
          image: '/images/fail.png',
        })
      }
      else{
        wx.showToast({
          title: '发布活动成功',
          duration: 1000,
        })
        wx.navigateBack()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      club_id: options.club_id,
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

  }
})