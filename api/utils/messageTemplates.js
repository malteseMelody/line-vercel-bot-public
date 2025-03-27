
const messages = require('../../richmenu-manager/data/messages');

// ///////////////////////////////////////////// 
// テキストメッセージの後にカルーセルメッセージを出力する
// カルーセルメッセージ(flexメッセージが横に複数並んでいる)を表示
// シミュレータ(Flex Message Simulator)上で一括で複数定義したものはflexMessage()を使って表示する
// flexメッセージ、カルーセルメッセージの作り方(Flex Message Simulator)は次を参照
// https://developers.line.biz/flex-simulator/
// 動画も載せられるようになったけど誰もしてないことに何かを感じるのでしない

async function setCarouselMessage(replyToken, ACCESS_TOKEN) {
  // テキストメッセージ（説明文）
  const textMessage = {
    type: "text",
    text: msgA4
  };

  // 各バブルの定義
const flex_message1 = {
  type: "bubble",
  backgroundColor: "#F3C2D5",
  body: {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "image",
        url: "https://line-vercel-bot-public2.vercel.app/carousel/cPark1.jpg",
        size: "full",
        aspectRatio: "1:1",
        aspectMode: "fit",
        action: {
          type: "uri",
          label: "駐車場全体地図",
          uri: "https://line-vercel-bot-public2.vercel.app/carousel/cPark1detail.png"
        }
      },
      {
        type: "text",
        text: "駐車場全体地図",
        align: "center",
        weight: "bold",
        size: "sm",
        color: "#333333"
      }
    ]
  }
};

const flex_message2 = {
  type: "bubble",
  backgroundColor: "#F8CBD0",
  body: {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "image",
        url: "https://line-vercel-bot-public2.vercel.app/carousel/cPark2.png",
        size: "full",
        aspectRatio: "1:1",
        aspectMode: "fit",
        action: {
          type: "uri",
          label: "無料駐車場",
          uri: "https://line-vercel-bot-public2.vercel.app/carousel/cPark2detail.png"
        }
      },
      {
        type: "text",
        text: "無料駐車場",
        align: "center",
        weight: "bold",
        size: "sm",
        color: "#333333"
      }
    ]
  }
};

const flex_message3 = {
  type: "bubble",
  backgroundColor: "#F8CBD0",
  body: {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "image",
        url: "https://line-vercel-bot-public2.vercel.app/carousel/cPark3.png",
        size: "full",
        aspectRatio: "1:1",
        aspectMode: "fit",
        action: {
          type: "uri",
          label: "無料駐車場の注意点",
          uri: "https://line-vercel-bot-public2.vercel.app/carousel/cPark3detail.png"
        }
      },
      {
        type: "text",
        text: "無料駐車場の注意点",
        align: "center",
        weight: "bold",
        size: "sm",
        color: "#333333"
      }
    ]
  }
};

  // カルーセルの内容として、bubble の配列を設定
  const carouselContents = [flex_message1, flex_message2, flex_message3];

  // Flex Message のカルーセルメッセージオブジェクト
  // altTextはクライアントがFlex Messageに対応していない場合に表示されるテキスト(必須)
  const flexMessage = {
    type: "flex",
    altText: "こちらはカルーセルメッセージです", 
    contents: {
      type: "carousel",
      contents: carouselContents
    }
  };

  // 送信するメッセージは、テキストとFlex Messageを配列にしてまとめて送る
	await sendReplyMessage(replyToken, [textMessage, flexMessage], ACCESS_TOKEN);

}

// /////////////////////////////////////////
// 絵文字入りメッセージを組み立てる
// LINEの絵文字は以下の場所にあるよ(絵文字は現状max20個まで指定可能)
// https://developers.line.biz/ja/docs/messaging-api/emoji-list/#line-emoji-definitions
function buildEmojiMessage(templateKey, mBody) {
	const { textTemplates, emojiMap } = require('../../richmenu-manager/data/messages');
	
  const rawText   = textTemplates[templateKey];
  const emojiList = emojiMap[templateKey];
  
  // followの挨拶の時、最初に「～さん、こんにちは」が入ることが
  // あるため、templeteKeyの値からはずれるときがある
  if (templateKey == "msgFollow") {
		rawText = mBody;
	}
	
	if (!rawText) {
    throw new Error(`テキストテンプレートが見つかりません: ${templateKey}`);
  }
	
  // $の個数をカウント
  // $がなかったらmatchはnullを返すのでlengthが誤動作するが
  // "|| []"(または空の配列、の意味)を返すことでlengthは0を返してくれるようになる
  const placeholderCount = (rawText.match(/\$/g) || []).length;
  
  if (!emojiList || placeholderCount !== emojiList.length) {
    throw new Error(`$の数(${placeholderCount})とemojiListの数(${emojiList ? emojiList.length : 0})が一致しません: ${templateKey}`);
  }
  
  let emojis = [];
  let i = 0;
  
  // $を最初からサーチ(0オリジン)
  let placeholderIndex = rawText.indexOf('$');  
  
  // $がなくなるまで文字列をサーチする
  while (placeholderIndex != -1) {
    emojis.push({
      index:     placeholderIndex,
      productId: emojiList[i].productId,
      emojiId:   emojiList[i].emojiId
    });

    // 見つかった$の次の位置からサーチを再開する
    // ちなみに改行\nも1文字、半角文字でも全角文字でも1文字とカウント
    // (多少の例外はあるみたいだから気をつけてね)
    placeholderIndex = rawText.indexOf("$", placeholderIndex + 1);
    i++;
  }
	
  return { type: "text", text: rawText, emojis: emojis };
	
}


function createImageMessage(url) {
  return {
    type: "image",
    originalContentUrl: url,
    previewImageUrl: url
  };
}


function createVideoMessage(videoUrl, previewImageUrl) {
  return {
    type: "video",
    originalContentUrl: videoUrl,
    previewImageUrl: previewImageUrl
  };
}

module.exports = {
	setCarouselMessage,
	buildEmojiMessage,
  createImageMessage,
  createVideoMessage
};
