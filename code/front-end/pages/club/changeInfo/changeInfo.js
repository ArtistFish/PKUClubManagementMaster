// pages/userInfo/authorization/authorization.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    if(e.currentTarget.dataset.cur == 'name'){
      this.setData({
        name:e.detail.value
      })
    }
    else if(e.currentTarget.dataset.cur == 'description'){
      this.setData({
        description: e.detail.value
      })
    }
  },

  tapCommit: function(){
    // console.log({
    //   name: this.data.name,
    //   description:this.data.description,
    //   presidentOpenid: app.globalData.openid,
    //   coverImg: this.data.coverImgList,
    //   contactImg: this.data.coverImgList,
    //   displayImgList: this.data.displayImgList,
    // })
    let illegal = false
    let re = /[^\u4E00-\u9FA5a-zA-Z]/
    let illegal_type = -1
    let illegal_inform = ['请输入合法的社团名!', '请输入合法的社团简介!', '请上传封面图片!', '请上传联系方式!', '请上传介绍图片!']
    if(re.test(this.data.name)){
      illegal = true
      illegal_type = 0
    }
    if(!illegal)
    {
      wx.showLoading({
        title: '修改中',
      })
      new Promise((resolve, reject) => {
        let imagesList = []
        imagesList.push(...this.data.coverImgList)
        imagesList.push(...this.data.contactImgList)
        imagesList.push(...this.data.displayImgList)
        let length = imagesList.length
        let cnt = 0
        let urls = {}
        for(let image of imagesList){
          app.updatePicture(image, res => {
            let data
            try
            {
              data = JSON.parse(res.data)
            }
            catch(err)
            {
              wx.hideLoading()
              wx.showToast({
                title: '图片尺寸过大！',
                image: '/images/fail.png',
                duration: 1000,          
              })
              return
            }          
            urls[imagesList.indexOf(image)] = data.filepath
            cnt += 1
            if(cnt == length){
              let urls_array =[]
              for(let key of Object.keys(urls)){
                urls_array.push(urls[key])
              }
              resolve(urls_array)
            }
          })
        }
        if (imagesList.length === 0)
        {
          resolve([])
        }
      }).then(urls_array => {
        let current_club = app.globalData.current_club
        console.log(current_club.raw_picture_urls.slice(2))
        let promises = []
        if (urls_array.length > 0)
        {
          for (let old_url of current_club.raw_picture_urls)
          {
            promises.push(new Promise((resolve, reject) => {
              app.deletePictureFromClub(current_club.club_id, old_url[1], res=>resolve(res))
            }))
          }
        }
        if (this.data.coverImgList.length === 0)
        {
          urls_array.splice(0, 0, current_club.raw_picture_urls[0][1])
        }
        if (this.data.contactImgList.length === 0)
        {
          urls_array.splice(1, 0, current_club.raw_picture_urls[1][1])
        }
        if (this.data.displayImgList.length === 0)
        {
          for (let old_url of current_club.raw_picture_urls.slice(2))
          {
            urls_array.push(old_url[1])
          }          
        }
        promises.push(new Promise((resolve, reject) => {
          app.setClubInfo(
            app.globalData.current_club.club_id,
            this.data.name === undefined ? current_club.club_name: this.data.name,
            this.data.description === undefined ? current_club.club_description: this.data.description,
            current_club.club_president_wxid,
            res=>resolve(res)
          )
        }))
        for (let pic_url of urls_array)
          {
            promises.push(new Promise((resolve, reject) => {
              app.addPictureToClub(current_club.club_id, pic_url, res=>resolve(res))
            }))
          } 
        Promise.all(promises).then((reses) => {
          console.log(reses)
          for (let res of reses)
          {
            if(res.data.status !== '200 OK')
            {
              wx.showToast({
                title: '修改信息失败',
                duration: 500,
              })
              setTimeout(() => {
                wx.navigateBack()
              }, 500)
              return
            }
          }
          wx.showToast({
            title: '修改信息成功',
            duration: 500,
          })
          wx.hideLoading()
          setTimeout(() => {
            wx.navigateTo({url: `/pages/club/frontpage/frontpage?club_id=${current_club.club_id}`})
          }, 500)
        })
      }).catch(() => {
        wx.hideLoading()
        console.log('修改社团信息失败，也不知道哪儿有问题')
      })
    }
    else{
      wx.showToast({
        title: illegal_inform[illegal_type],
        icon: 'none',
      })
    }
    
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