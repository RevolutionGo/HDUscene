// pages/show/show.js
const app = getApp()
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;
var current_id=0;
wx.cloud.init({
  env: 'hdu'
});

Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: '',
    title:'',
    price:'',
    hiddenLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var Id = options.Id;
    current_id = parseInt(options['Id'])
    console.log(Id, current_id);
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
          img: res.data[Id].img,
          title: res.data[Id].title,
          price: res.data[Id].price
        })
      }
    })
  },
  onShow: function () {
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  onReady: function () {
    // 页面渲染完成 
    var tt = this;
    setTimeout(function () {
      tt.setData({
        hiddenLoading: true
      });
      tt.update();
    }, 900)
  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    // 向左滑动   
    if (touchMove - touchDot <= -40 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      console.log("向右滑动");
      if (current_id < 15){
      wx.navigateTo({
        url: './show?Id=' + (current_id + 1)
      })
      }
    }
    // 向右滑动   
    if (touchMove - touchDot >= 40 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      console.log("向左滑动");
      if (current_id!=0){
      wx.navigateTo({
        url: './show?Id=' + (current_id - 1)
      })
      }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
//监听页面卸载的函数，把页面重定向到首页
  onUnload: function () {
    // 页面渲染卸载 
    wx.showToast({
      icon: 'loading',
      title: '加载中...',
    })
    wx.reLaunch({
      url: '../index/index'
    })
  },
  saveImg: function () {
    wx.cloud.downloadFile({
      fileID: 'cloud://hdu-v6ikm.6864-hdu-v6ikm/images/' + current_id +'.jpg',
      success: function (res) {
        let path = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            console.log(res)
            wx.showToast({
              icon: '下载',
              title: '下载成功',
            })
          },
          fail(res) {
            console.log(res)
            wx.showToast({
              icon: 'none',
              title: '下载失败',
            })
          },
          complete(res) {
            console.log(res)
          }
        })
      }, fail: function (res) {
        console.log(res)
      }
    })

  },

  onShareAppMessage: function () {
    let that = this;
    return {
      title: '杭电风略', // 转发后 所显示的title
      path: '/pages/show/show?Id=' + current_id, // 相对的路径
      success: (res) => {    // 成功后要做的事情
        console.log(res.shareTickets[0])
        // console.log

        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
            console.log(that.setData.isShow)
          },
          fail: function (res) { console.log(res) },
          complete: function (res) { console.log(res) }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }

})