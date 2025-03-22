const { handleRichMenu } = require('../../richmenu-manager/richMenuHandler');
const { setSpreadsheet } = require('../utils/spreadsheet');
const { createImageMessage, createVideoMessage } = require('../utils/messageTemplates');
const { textMessages, mediaMessages, textTemplates, emojiMap } = require('../../richmenu-manager/data/messages');
const { getSheetData, writeSheetData } = require('../utils/spreadsheet');
const axios = require('axios');
const messages = require('../../richmenu-manager/data/messages');


// ///////////////////////////////////////////
// eventタイプで処理を振り分ける
async function handleEvent(event, ACCESS_TOKEN) {
  switch (event.type) {
    case 'message':
      await handleMessageEvent(event, ACCESS_TOKEN);
      break;
    case 'postback':
      await handlePostbackEvent(event, ACCESS_TOKEN);
      break;
    case 'follow':
      await handleFollowEvent(event, ACCESS_TOKEN);
      break;
    case 'unfollow':
    	break;
    default:
      console.log('Unhandled event type:', event.type);
  }
}


// ///////////////////////////////////////////
// followイベントの処理
async function handleFollowEvent(event, ACCESS_TOKEN) {
  const name = arguments.callee.name;
  // logToSpreadsheet(name, "follow受信:event=" + JSON.stringify(event));

  let groupId = null;
  if (event.source.type === 'group') { 
    groupId = event.source.groupId; 
  }
  // スプレッドシートへの書き込み処理
  let flg = await setSpreadsheet(groupId, event.source.userId, event.replyToken, ACCESS_TOKEN);
  if (!flg) { return; }
  
  let mBody;
  let message = [];
  
  const displayName = await getDisplayName(event.source.userId, ACCESS_TOKEN);
  
  // dispayNameの中に$があったら表示しない(絵文字の数と位置に狂いが出る為)
  if (displayName == null) {
    mBody = msgFollow;
  } 
  else {
    if (displayName.includes("$")) {
      mBody = msgFollow;
    } else {
      mBody = displayName + "さん、" + msgFollow;
    }
  }

  try {
		// 絵文字付きテキストを組み立てる
  	const emojiTextMessage = buildEmojiMessage("msgFollow", mBody);
    message = emojiTextMessage;
  } catch (error) {
    console.warn(`follow絵文字メッセージの構築失敗: ${error.message}`);
    // エラー時は簡易メッセージを送る
    message = { type: "text", text: "エラーが発生しました。" };
  }
  
  await sendReplyMessage(event.replyToken, [message], ACCESS_TOKEN);
}


// ///////////////////////////////////////////
// messageイベントの処理
async function handleMessageEvent(event, ACCESS_TOKEN) {
  let message = [];
  const name = arguments.callee.name;
  const data = event.message.text;
  
  // コマンドラインから入力したときここに来る
  if (data == "ワイワイ" ) {
  	try {
			// 絵文字付きテキストを組み立てる
    	const emojiTextMessage = buildEmojiMessage(data);
    	message.push(emojiTextMessage);
  	} catch (error) {
    	console.warn(`message絵文字メッセージの構築失敗: ${error.message}`);
  	}
  }
  else {  
    // コマンドラインから何か叩くとメッセージとして通知される
    // 問い合わせは受け付けてないのでエラーにする
    message = { type: "text", text: msgPostpone };
  }
  
  await sendReplyMessage(event.replyToken, [message], ACCESS_TOKEN);
  
  return;
}




// ////////////////////////////////////////////////////
// postbackイベント：リッチメニューのタップ処理へ委譲
async function handlePostbackEvent(event, ACCESS_TOKEN) {

  // タブ切り替えが起きたというお知らせ(特に何もしない)
  if ( event.postback.data == "change to A" 
    || event.postback.data == "change to B" ) {
     return; 
  }

  // 最初がtap_richMenuで始まるならリッチメニューをタップしたということ
  if (event.postback.data.startsWith("tap_richMenu"))  { 
    await handleRichMenuTap(event.postback.data, event.replyToken, ACCESS_TOKEN);
  } 
}


// ///////////////////////////////////////////////
// リッチメニュータップのバッチ処理
async function handleRichMenuTap(data, replyToken, ACCESS_TOKEN) {
  let messages = [];
  
  // 画像、動画メッセージにマッチするか？
  if (mediaMessages[data]) {
  	messages = mediaMessages[data];
	}
	
  // テキストメッセージにマッチするか？
  else if (textMessages[data]) {
    messages.push({ type: "text", text: textMessages[data] });
    console.log("送信予定テキスト: ", textMessages[data]);
  } 
  
	// カルーセルメッセージ専用処理
	else if (data == "tap_richMenuA4") {
  	await setCarouselMessage(replyToken, ACCESS_TOKEN);
  	return;
  }
  
  // 絵文字にマッチするか？
  try {
		if (textTemplates[data]) {
			// 絵文字付きテキストを組み立てる
  	  const emojiTextMessage = buildEmojiMessage(data,"");
    	messages.push(emojiTextMessage);
    }
  } catch (error) {
    console.warn(`Poskback絵文字メッセージの構築失敗: ${error.message}`);
  }
  
  if (messages.length === 0) {
    console.warn(`Poskbackで情報が見つかりませんでした: ${data.toString()}`);
  }
  
  
  // まとめて1回のAPIリクエストで返信
  if (messages.length > 0) {
		await sendReplyMessage(replyToken, messages, ACCESS_TOKEN);
  }
}


// ///////////////////////////////////////////////
// Replyメッセージ送信
async function sendReplyMessage(replyToken, messages, ACCESS_TOKEN) {
  const url = 'https://api.line.me/v2/bot/message/reply';

  await axios.post(
    url,
    { replyToken, messages },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      }
    }
  );
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


module.exports = {
  handleEvent,
  handleFollowEvent,
  handleMessageEvent,
  handlePostbackEvent,
  handleRichMenuTap,
  sendReplyMessage,
  sendPushMessage
};

