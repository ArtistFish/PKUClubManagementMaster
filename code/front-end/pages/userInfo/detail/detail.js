// pages/userInfo/detail/detail.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarImg: []
  },
  // tapUpload: function(){
  //   console.log(app.globalData.ourUserInfo.name)
  //   if(this.data.avatarImg.length < 1){
  //     wx.showToast({
  //       title: '请指定图片',
  //       image: '/images/fail.png'
  //     })
  //   }
  //   else{
  //     app.updatePicture(this.data.avatarImg[0], res => {
  //       let data = JSON.parse(res.data)
  //       if(data.status == '200 OK'){
  //         console.log(data.filepath)
  //         console.log(app.globalData.ourUserInfo.name)
  //         app.setUserInfo(app.globalData.globalData.openid, app.globalData.ourUserInfo.name, data.filepath, res => {
  //           if(res.data.status == '200 OK'){
  //             wx.showToast({
  //               titile: '更新成功',
  //             })
  //             setTimeout(() => {
  //               wx.navigateTo({
  //                 url: '/pages/index/index?CurPage=userinfo'
  //               }, 200)
  //             })
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  ChooseImage: function(e) {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          avatarImg: res.tempFilePaths
        })
      }
    });
  },
  ViewImage: function(e) {
    let _this = this
    wx.previewImage({
      urls: _this.data.avatarImg,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg: function(e) {
    let index = e.currentTarget.dataset.index
    wx.showModal({
      title: '警告',
      content: '确定要删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.setData({
            avatarImg: this.data.avatarImg.splice(index, 1)
          })
        }
      }
    })
  },
  editInfo: function(e){
    let innerText = undefined
    let title = e.currentTarget.dataset.cur
    if(title == '姓名'){
      innerText = app.globalData.ourUserInfo.name
    }
    else if(title == '年龄'){
      innerText = app.globalData.ourUserInfo.age
    }
    else if(title == '性别'){
      innerText = app.globalData.ourUserInfo.sex
    }
    else if(title == '学校'){
      innerText = app.globalData.ourUserInfo.school
    }
    else
      throw Error('unkonw edit title type!')
    wx.navigateTo({
      url: '../edit/edit?title=' + title + '&innerText=' + innerText,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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