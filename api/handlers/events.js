const { handleRichMenu } = require('../../richmenu-manager/richMenuHandler');
const { writeUserDataToExcel } = require("../utils/excelWriter");
const { sendReplyMessage, getUserProfile } = require('../utils/lineApiHelpers');
const { setCarouselMessage, createImageMessage, createVideoMessage, buildEmojiMessage } = require('../utils/messageTemplates');
const { textMessages, mediaMessages, textTemplates, emojiMap } = require('../../richmenu-manager/data/messages');
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
  let mBody;
  let message = [];
	
	const userId = event.source.userId;
  const groupId = event.source.groupId || null;
  
  const profile = await getUserProfile(userId, ACCESS_TOKEN);
  
  const { displayName, pictureUrl, statusMessage } = profile;
  
  // 書き込み処理
  writeUserDataToExcel(groupId, userId, displayName, pictureUrl, statusMessage);
  
  const followText  = textTemplates["msgFollow"];
  
  // dispayNameの中に$があったら表示しない(絵文字の数と位置に狂いが出る為)
	if (displayName == null || displayName.includes("$")) {
  	mBody = followText;
	} else {
  	mBody = `${displayName}さん、${followText}`;
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
  const data = event.message.text;
  
  // コマンドラインから入力したときここに来る
  if (data == "ワイワイ" ) {
    message = { type: "text", text: messages.msgY };
  }
  else {  
    // コマンドラインから何か叩くとメッセージとして通知される
    // 問い合わせは受け付けてないのでエラーにする
    message = { type: "text", text: messages.msgPostpone };
  }
  
  await sendReplyMessage(event.replyToken, [message], ACCESS_TOKEN);
  
  return;
}




// ////////////////////////////////////////////////////
// postbackイベント：リッチメニューのタップ処理へ委譲
async function handlePostbackEvent(event, ACCESS_TOKEN) {

  // 最初がtap_richMenuで始まるならリッチメニューをタップしたということ
  if (event.postback.data.startsWith("tap_richMenu"))  { 
    await handleRichMenuTap(event.postback.data, event.replyToken, ACCESS_TOKEN);
    return;
  } 
  
  // タブ切り替えが起きたというお知らせ(特に何もしない)
  if ( event.postback.data == "change to A" 
    || event.postback.data == "change to B" ) {
     return; 
  }

}


// ///////////////////////////////////////////////
// リッチメニュータップのバッチ処理
async function handleRichMenuTap(data, replyToken, ACCESS_TOKEN) {
  let messages = [];
  
  console.log("🔍 postback data:", data, "（型:", typeof data, "）");
  
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
		console.log("🎯 tap_richMenuA4 マッチしました");
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
		console.log("Reply Token:", replyToken);
		console.log("送信メッセージ:", JSON.stringify(messages, null, 2));
		await sendReplyMessage(replyToken, messages, ACCESS_TOKEN);
  }
}


module.exports = {
  handleEvent,
  handleFollowEvent,
  handleMessageEvent,
  handlePostbackEvent,
  handleRichMenuTap
};

