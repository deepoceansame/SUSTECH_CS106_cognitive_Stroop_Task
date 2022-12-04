Page({
  data: {
    gd: {},
    envId: '',
  },

  onLoad(options) {
    console.log("testRoom onLoad");
    const gd = getApp().globalData;
    this.setData({
      envId: options.envId,
      gd: gd,
    });
  },

  goToTestRoom(e){
    wx.redirectTo({
      url: `/pages/taskTestRoom/index?envId=${this.data.envId}`,
    });
  }
});