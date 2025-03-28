
const axios = require('axios');

// ///////////////////////////////////////////////
// Replyメッセージ送信
async function sendReplyMessage(replyToken, messages, ACCESS_TOKEN) {
  const url = 'https://api.line.me/v2/bot/message/reply';

  try {
    const response = await axios.post(
      url,
      { replyToken, messages },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        }
      }
    );
    console.log("LINEメッセージ送信成功", response.data);
  } catch (error) {
    if (error.response) {
      console.error("❌LINEメッセージ送信失敗:", error.response.status);
    } else {
      console.error("❌ネットワークまたはaxiosレベルのエラー:", error.message);
    }
  }
}


// ///////////////////////////////////////////////
// プッシュメッセージ送信
async function sendPushMessage(userId, messages, ACCESS_TOKEN) {
  const url = 'https://api.line.me/v2/bot/message/push';

  try {
    const response = await axios.post(
      url,
      {
        to: userId,
        messages: messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      }
    );
    console.log('プッシュ成功:', response.data);
  } catch (error) {
    console.error('プッシュエラー:', error.response ? error.response.data : error.message);
  }
}


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
  sendReplyMessage,
  sendPushMessage,
	getDisplayName,
	getPictureUrl,
  getStatusMessage
};
