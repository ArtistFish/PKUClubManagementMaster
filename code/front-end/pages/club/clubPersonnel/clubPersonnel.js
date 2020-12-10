// pages/clubPersonnel/clubPersonnel.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
    userIsPresident: app.globalData.userIsPresident,
    userIsManager: app.globalData.userIsManager,
    userName: app.globalData.userName,
    tabs:[
      "查看个人主页",
      "移交会长",
      "任命管理员",
      "移除管理员"
    ],
    persons: {
      manager:
      {
        style: "text-orange",
        role_name: "社团骨干",
        showall: 0,
        personlist: [
          {
            name: 'zrf',
            duty: '会长',
            avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg'
          },
          {
            name: 'yqc',
            duty: '管理员',
            avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10004.jpg'
          },
        ],
      },
      member:
      {
        style: "text-gray",
        role_name: "社团成员",    
        showall: 0,
        personlist: [
          {
            name: 'hr',
            avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10003.jpg'
          },
          {
            name: 'zz',
            avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
          },
        ]
      },
    },   
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

  },

  showPersons: function (e) {
    let personKind = e.currentTarget.dataset.personkind
    let onshow = this.data.persons[personKind].showall
    let key = `persons.${personKind}.showall`
    this.setData(
      {
        [key]: 1 - onshow
      }
    )
  },

  showModal(e) {
    let duty = e.currentTarget.dataset.personduty
    if (duty === undefined) {duty = 'member'}
    else if (duty === '会长') {duty = 'president'}
    else if (duty === '管理员') {duty = 'manager'}
    else {alert(`wrong duty: ${duty}`)}
    let modalName = e.currentTarget.dataset.personname
    let userName = this.data.userName
    let userIsPresident = this.data.userIsPresident
    let userIsManager = this.data.userIsManager
    let userIsMember = this.data.userIsMember
    this.setData({
      showTab: [
        true,
        userName !== modalName && (userIsPresident && duty === 'manager'),
        userName !== modalName && (userIsPresident && duty === 'member'),
        (userIsPresident && duty==='manager') || (userIsManager && userName === modalName)
      ],
      modalShow: true,
      modalName: modalName,
    })
  },

  hideModal(e) {
    this.setData({
      modalShow: false
    })
  },

  tabClick(e) {
    let tabInd = e.currentTarget.dataset.tabindex
    let tabContent = this.data.tabs[tabInd]
    let modalName = this.data.modalName
    let content = [
      null,
      `将会长移交给${modalName}？`,
      `将${modalName}设为社团管理员？`,
      `移除${modalName}的管理员身份？`
    ]
    // 查看主页不需要检查
    if (tabInd > 0)
    {
      wx.showModal({
        title: tabContent,
        content: content[tabInd],
        cancelColor: 'cancelColor',
        success: res=>{console.log(res)},
        fail: res=>{console.log(res)}
      })
    }
      
  }
})