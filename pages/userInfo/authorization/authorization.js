// pages/userInfo/authorization/authorization.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    schoolList: ['北京大学', '清华大学'],
    majorList: ['EE', 'CS'],
    schoolIndex: 0,
    majorIndex: 0,
    name: undefined,
    ID: undefined,
    sex: undefined,
  },
  SchoolPickerChange(e) {
    console.log(e);
    this.setData({
      schoolIndex: e.detail.value
    })
  },
  MajorPickerChange(e) {
    console.log(e);
    this.setData({
      majorIndex: e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  editInput: function(e){
    if(e.currentTarget.dataset.cur == 'name'){
      this.setData({
        name:e.detail.value
      })
    }
    else if(e.currentTarget.dataset.cur == 'ID'){
      this.setData({
        ID: e.detail.value
      })
    }
  },
  tapRadio: function(e){
    this.setData({
      sex: e.currentTarget.dataset.cur == 'male' ? '男' : '女',
    })
  },
  tapCommit: function(){
    console.log({
      name: this.data.name,
      ID:this.data.ID,
      sex: this.data.sex,
      school: this.data.schoolList[this.data.schoolIndex],
      major: this.data.majorList[this.data.majorIndex],
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