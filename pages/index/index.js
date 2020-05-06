// page/index/index.js
//获取应用实例
const app = getApp()

// 初始化 cloud
wx.cloud.init({ env: 'hdu'});

Page({
    /**
     * 页面的初始数据
     */
    data: {
      userInfo: {},
      logged: false,
      takeSession: false,
      grides: []
    },


  onLoad: function () {
    var _this = this;
    //1、引用数据库
    const db = wx.cloud.database({
      //这个是环境ID不是环境名称
      env: 'hdu-v6ikm'
    })
    //2、开始查询数据了  grides对应的是集合的名称
    db.collection('grides').get({
      //如果查询成功的话
      success: res => {
        //这一步很重要，给grides赋值，没有这一步的话，前台就不会显示值
        this.setData({
          grides: res.data
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    // 获取用户openId
    this.onGetOpenid()
  },
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'add',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '获取 openid 失败，请检查是否有部署 login 云函数',
        })
      }
    })
  },
  
  //事件处理函数
  adddetial: function () {
    wx.navigateTo({
      url: '../new/new',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
     
})