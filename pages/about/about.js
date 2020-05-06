// about.js
Page({
  data: {
    
    grides: [
      {
        img: 'http://www.hdu.edu.cn/asset/home/images/logo.png',
        title:'浙江省首批重点建设高校 |省部共建大学',
        position: '地址： 杭州市江干区白杨街道2号大街1158号'
      }],

  },
  markers: [{
    iconPath: '/images/location.png',
    id: 0,
    latitude: 30.31432,
    longitude: 120.340754,
    width: 50,
    height: 50
  }],
  controls: [{
    id: 1,
    iconPath: '/images/location.png',
    position: {
      left: 0,
      top: 300 - 50,
      width: 50,
      height: 50
    },
    clickable: true
  }],
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})


