Page({
  data: {
    gd: {},
    envId: '',
  },

  onLoad(options) {
    console.log("\nTest Room onload");
    const gd = getApp().globalData;
    this.setData({
      envId: options.envId,
      gd: gd,
    });
    this.createProblem();
  },

  createProblem(){
    console.log("create problem")
  },

  afterChosen(e){
    this.recordElapsedTime();
    this.recordIsCorrect();
    this.storeData();
    const gd = this.data.gd;
    var cur_task = gd.current_task;
    const task_tested_num = gd.task_tested_num;
    const task_exp_num = gd.task_exp_num;
    task_tested_num[cur_task-1] += 1;
    console.log("cur_task:"+cur_task);
    if(task_tested_num[cur_task-1] == task_exp_num[cur_task-1]){
      gd.current_task += 1;
      if(gd.current_task == 4){
        console.log("goToResultPage");
        wx.redirectTo({
          url: `/pages/resultPage/index?envId=${this.data.envId}`,
        });
      }
      else{
        console.log("goToPrepareRoom");
        wx.redirectTo({
          url: `/pages/taskPrepareRoom/index?envId=${this.data.envId}`,
        });
      }
    }
    else{
      console.log("goToTestRoom")
      wx.redirectTo({
        url: `/pages/taskTestRoom/index?envId=${this.data.envId}`,
      });
    }
  },

  recordElapsedTime(){
    console.log("record elapsed time");
    const gd = this.data.gd;
    if(gd.current_task == 1){
      console.log("time task1 pushed");
      gd.time_elapsed_task1.push(1.3);
    }
    else if(gd.current_task == 2){
      gd.time_elapsed_task2.push(1.4);
    }
    else{
      gd.time_elapsed_task3.push(1.5);
    }
  },
  recordIsCorrect(){
    console.log("record isCorrect");
    const gd = this.data.gd;
    if(gd.current_task == 1){
      gd.isCorrect_task1.push(1);
    }
    else if(gd.current_task == 2){
      gd.isCorrect_task2.push(0);
    }
    else{
      gd.isCorrect_task3.push(1);
    }
  },
  storeData(){
    console.log("store Data");
  },
});