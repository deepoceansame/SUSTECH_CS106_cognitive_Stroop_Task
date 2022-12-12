Page({
  data: {
    gd: {},
    envId: '',
    used_time: 0,
    title: '',
    color: 1,
    text: 1,
    right: 0,
    choice: [],
    start_time: 0,
    end_time: 0,
  },

  onShow(options) {
    var myDate = new Date();
    console.log('test room onshow');
    console.log('options '+options);
    this.data.start_time = myDate.getTime();
    console.log('start time '+ this.data.start_time);
  },

  onLoad(options) {
    console.log("\nTest Room onload");
    const gd = getApp().globalData;
    var title = '选择图中文字意思所表示的颜色';
    if (gd.current_task==3){
      title = '选择图中文字的填充颜色';
    }
    console.log("\ntitle: ", title);
    this.setData({
      envId: options.envId,
      gd: gd,
      title: title,
    });
    this.createProblem();
  },

  createProblem(){
    console.log("create problem");
    const gd = getApp().globalData;
    if (gd.current_task==1){
      var color = Math.floor(Math.random() * 6) + 1;
      var text = color;
      var all = [1,2,3,4,5,6];
      var choice = [0,0,0,0];
      all[text-1] = 0;
      var right = Math.floor(Math.random() * 4);
      choice[right] = text;
      var other = text;
      for (var i = 0; i < 3; i++) {
        var step = Math.floor(Math.random() * 5);
        other = (other + step) % 6;
        while (all[other] == 0){
          other = (other+1)%6;
        }
        right = (right + 1)%4;
        choice[right]=all[other];
        all[other]=0;
      }
    } else{
      var color = Math.floor(Math.random() * 5) + 1;
      var text = Math.floor(Math.random() * 5) + 1;
      var step = Math.floor(Math.random() * 4)
      text += step;
      text %= 5;
      text++
      step = Math.floor(Math.random() * 4)
      color += step;
      color %= 5;
      color++
      while (text==color){
        step = Math.floor(Math.random() * 4)
        text += step;
        text %= 5;
        text++
        step = Math.floor(Math.random() * 4)
        color += step;
        color %= 5;
        color++
      }
      var all = [1,2,3,4,5];
      var choice = [0,0,0,0];
      var right = Math.floor(Math.random() * 4);
      if (gd.current_task==2){
        all[text-1] = 0;
        choice[right] = text;
        var other = text;
      } else {
        all[color-1] = 0;
        choice[right] = color;
        var other = color;
      }
      for (var i = 0; i < 3; i++) {
        var step = Math.floor(Math.random() * 5);
        other = (other + step) % 5;
        while (all[other] == 0){
          other = (other+1)%5;
        }
        right = (right + 1)%4;
        choice[right]=all[other];
        all[other]=0;
      }
    }
    var choice_text = [];
    for (var i = 0; i < 4; i++) {
      switch (choice[i]){
        case 1:
          choice_text[i] = '红色'
          break;
        case 2:
          choice_text[i] = '黄色'
          break;
        case 3:
          choice_text[i] = '蓝色'
          break;
        case 4:
          choice_text[i] = '绿色'
          break;
        case 5:
          choice_text[i] = '紫色'
          break;
        case 6:
          choice_text[i] = '黑色'
          break;
      }
    }
    right = (right + 1)%4+1;
    this.setData({
      choice: choice_text,
      color: color,
      text: text,
      right: right
    });
  },

  afterChosen(e){
    var choose = e.currentTarget.dataset.choose;
    this.recordElapsedTime();
    this.recordIsCorrect(choose == this.data.right);
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
    // TODO 计时给used_time 用于储存
    var myDate = new Date();
    this.data.end_time = myDate.getTime();
    this.data.used_time = this.data.end_time - this.data.start_time;
    console.log("task" + this.data.cur_task + "record elapsed time" + this.data.used_time);
    const gd = this.data.gd;
    if(gd.current_task == 1){
      console.log("time task1 pushed");
      gd.time_elapsed_task1.push(this.data.used_time);
    }
    else if(gd.current_task == 2){
      gd.time_elapsed_task2.push(this.data.used_time);
    }
    else{
      gd.time_elapsed_task3.push(this.data.used_time);
    }
  },
  recordIsCorrect(correct){
    // TODO 储存需要is_correct is_correct指本次test是否正确 0 表不正确 1 表正确
    this.data.is_correct = correct;
    console.log("record isCorrect");
    const gd = this.data.gd;
    if(gd.current_task == 1){
      gd.isCorrect_task1.push(correct);
    }
    else if(gd.current_task == 2){
      gd.isCorrect_task2.push(correct);
    }
    else{
      gd.isCorrect_task3.push(correct);
    }
  },

  storeData(){
    const gd = this.data.gd;
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'addRecord',
        testee_id: gd.testee_id,
        task_id: gd.current_task,
        is_correct: this.data.is_correct,
        used_time: this.data.used_time,
        test_time: this.data.end_time,
      }
    }).then((resp) => {
      console.log(resp);
      console.log('下面是是否插入到数据库里的record');
      console.log(resp.result.event);
   }).catch((e) => {
     console.log(e);
   });
    console.log("store Data");
  },
});