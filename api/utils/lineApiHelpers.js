
const axios = require('axios');

// //////////////////////////////////////////////////
// 表示名(displayName)を取得する
async function getDisplayName(userId, ACCESS_TOKEN) {
  const url = `https://api.line.me/v2/bot/profile/${userId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    });

    return response.data.displayName;

  } catch (error) {
    console.error("ユーザー名未指定: ", error.message);
    return null;
  }
};


// //////////////////////////////////////////////////
//アイコン画像のurlを取得する(アイコン未設定は未評価)
async function getPictureUrl(userId, ACCESS_TOKEN) {
  const url = `https://api.line.me/v2/bot/profile/${userId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    });

    return response.data.pictureUrl;

  } catch (error) {
    console.error("写真未指定: ", error.message);
    return null;
  }
};


// //////////////////////////////////////////////////
// ステータスメッセージを取得する
async function getStatusMessage(userId, ACCESS_TOKEN) {
  const url = `https://api.line.me/v2/bot/profile/${userId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    });

    return response.data.statusMessage;

  } catch (error) {
    console.error("ステータスメッセージ未指定: ", error.message);
    return null;
  }
};


module.exports = {
	getDisplayName,
	getPictureUrl,
  getStatusMessage
};
