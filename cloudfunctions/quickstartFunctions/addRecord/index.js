const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    await db.collection('stroop_result').add({
      data: {
        testee_id: event.testee_id,
        task_id: event.task_id,
        is_correct: event.is_correct,
        used_time: event.used_time,
      }
    });
    return {
      success: true,
      message: 'add record success',
      event: event
    };
  } catch (e) {
    return {
      success: false,
      message: 'add record failed'
    };
  }
};
