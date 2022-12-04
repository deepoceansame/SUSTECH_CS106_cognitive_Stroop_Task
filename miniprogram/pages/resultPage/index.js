Page({
  data: {
    gd: {},
    envId: '',
  },

  onLoad(options) {
    console.log("\nResult page onLoad");
    const gd = getApp().globalData;
    this.setData({
      envId: options.envId,
      gd: gd,
    });
  },

  backToIndex(e){
    const gd = this.data.gd;
    gd.task_tested_num = [0, 0, 0];
    gd.task_exp_num = [2, 3, 3];
    gd.current_task = 1;
    //gd.testee_id = "dummy";
    gd.time_elapsed_task1 = [];
    gd.time_elapsed_task2 = [];
    gd.time_elapsed_task3 = [];
    gd.isCorrect_task1 = [];
    gd.isCorrect_task2 = [];
    gd.isCorrect_task3 = [];
    wx.redirectTo({
      url: `/pages/index/index?envId=${this.data.envId}`,
    });
  }
});