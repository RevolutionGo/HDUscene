Page({

  data: {
    titleCount: 0,
    contentCount: 0,
    title: '',
    content: '',
    images: [],
    images_fileID: []
  },

  onLoad(options) {

  },

  handleTitleInput(e) {
    this.setData({
      title: e.detail.value,
      titleCount: e.detail.value.length
    })
  },

  handleContentInput(e) {
    this.setData({
      content: e.detail.value,
      contentCount: e.detail.value.length
    })
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        this.setData({
          images: images.length <= 1 ? images : images.slice(0, 1)
        })
        //将照片上传至云端需要刚才存储的临时地址
        wx.cloud.uploadFile({
          cloudPath: '/images/' + images[0],
          filePath: images[0],
          success(res) {
            //上传成功后会返回永久地址
            console.log(res.fileID)
          }
        })
      }
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    //const images = this.data.images.splice(idx, 1)
    this.setData({
      images: []
    })
//console.log(idx,images)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    console.log(idx)
    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },

  //添加
  res: function (e) {
    var that = this;
    const db = wx.cloud.database()
    db.collection('news').add({
      data: {
        title: e.detail.value.title,
        content: e.detail.value.content,
        images: e.detail.value.images,
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          title: e.detail.value.title,
          content: e.detail.value.content,
          images: e.detail.value.images,
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

})