const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const _ = db.command;
    await db.collection('stroop_result').where({
      _id: _.exists(true)
      }).remove();
    return {
      success: true,
      message: 'haved removed all'
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: e
    };
  }
};
