// //////////////////////////////////////////////////
// スプレッドシートの書き込み順(左からのオフセット。1オリジン)
const numGroupId     = 1;  // lINEのgroupId
const numUserId      = 2;  // LINEのuserId
const numDisplayName = 3;  // ユーザの表示名
const numPictureUrl  = 4;  // ユーザのアイコンへのURL
const numStatusMsg   = 5;  // ユーザのステータスメッセージ
const numLineShop    = 6;  // LINEで通知された店舗名


// ////////////////////////////////////////////////
// 出力メッセージはここで一括定義
const msgA1 = "・イベント名：WAN'S Dog Expo 2025 Marina City\n・開催予定時期：2025年02月22～23日(土・日)少雨決行\n※荒天中止\n※中止の際はSNSにて発信いたします。\n・開催場所：和歌山マリーナシティ　第三駐車場\n（〒641-0014 和歌山県和歌山市毛見１５２７）\n・開催時間：09:30～16:00\n・料金：入場料￥1,000（小学生以下無料）\n・出店内容：犬関連商品の小売店舗、キッチンカー\n・出店予定数：200ブース";   

const msgA2 = "何か動画くださーい";

const msgA3 = "会場MAPになります！\nぜひ、インスタグラムに載せてお友達に教えてあげてくださいね！\n\n高画質ver.は↓下記URLよりダウンロード可能です！\n https://inuichiba.com/cn7/pg1168259.html ";

const msgA4 = "こちらでは【有料】と【無料】2種類の駐車場をご用意しております。\n尚、会場近くにある商業施設の駐車場へのご駐車は施設を利用される方のご迷惑となりますのでご遠慮ください。\n\n詳細は画像をタップしてください。詳細画面では画像の拡大もできます";

const msgA5 = "イベントを楽しむためのグッドマナーと注意事項です！！\n\n・マスクの着用はご自身の判断でのご参加をお願いいたします\n\n・体調不良の方や発熱がある方は参加自粛をお願いいたします\n\n・マナーベルト/マナーおむつの着用をお願いいたします\n\n・会場施設は多くの人やわんちゃんが通ります。マナー・ご配慮いただきますようお願いいたします\n\n・ワンちゃんのトイレは指定場所以外ではさせないようお願いいたします\n\n・ワンちゃんのうんちはそのままにせず、飼い主さまが必ず家に持ち帰ってから処分してください\n\n・会場にはゴミ捨て場はございませんので、各自ゴミはお持ち帰りをお願いいたします\n\n・ご来場の際は、首輪または胴輪(ハーネス等)を着用し、必ずリードをしてください\n※ロングリードや伸縮リードは万が一何かあった場合に制御できませんので禁止とさせていただきます。";

const msgB1 = "・イベント名：WAN'S Dog Expo 2025 Marina City\n・開催予定時期：2025年02月22～23日(土・日)少雨決行\n※荒天中止\n※中止の際はSNSにて発信いたします。\n・開催場所：和歌山マリーナシティ　第三駐車場\n（〒641-0014 和歌山県和歌山市毛見１５２７）\n・開催時間：09:30～16:00\n・料金：入場料￥1,000（小学生以下無料）\n・出店内容：犬関連商品の小売店舗、キッチンカー\n・出店予定数：200ブース";   
const msgB2 = "現在準備中です。\n情報更新まで今しばらくお待ちください。";
const msgB3 = "現在準備中です。\n情報更新まで今しばらくお待ちください。";
const msgB4 = "現在準備中です。\n情報更新まで今しばらくお待ちください。";

const msgTimeoutAppend = "タイムアウトを検知したためファイルへの書き込みに失敗しました。\nもう一度処理を行ってください。";

const msgPostpone = "メッセージありがとうございます！\n申し訳ございませんが、こちらのアカウントでは個別のお問い合わせには対応しておりません。\nどうぞ次の配信をお待ちください。\n\nもしメニューをご覧いただけない場合は、左下の「≡」のマークをタップしていただくか、一度トーク画面を閉じて再度開いてください。";


// //////////////////////////////////////////////////
// 画像、動画の固定ディレクトリ
const baseDir = "https://line-vercel-bot-public2.vercel.app/";


// //////////////////////////////////////////////////
// messageTemplates.jsで使うPostbackイベントの対応付け
// 上記で宣言した後にこのロジックを持ってくること
// テキストメッセージ(カルーセルメッセージのテキスト部分はここで定義しちゃ駄目)
const textMessages = {
  "tap_richMenuA1"  : msgA1,
  "tap_richMenuA5"  : msgA5,
  "tap_richMenuB1"  : msgB1,
  "tap_richMenuB2"  : msgB2,
  "tap_richMenuB3"  : msgB3,
  "tap_richMenuB4"  : msgB4
};


// 画像・動画メッセージ
const mediaMessages = {
	"tap_richMenuA2": [
		{ type: "text", text: msgA2 },
    { type: "video",
      originalContentUrl: `${baseDir}videos/haro16_9.mp4`,
      previewImageUrl:   "https://line-vercel-bot-public2.vercel.app/images/videoiPrev1.jpg" }
                   ],
	"tap_richMenuA3": [
		{ type: "text", text: msgA3 },
    { type: "image",
      originalContentUrl: "https://line-vercel-bot-public2.vercel.app/images/dog2.jpg",
      previewImageUrl:     "https://line-vercel-bot-public2.vercel.app/images/dog2.jpg" }
                   ]
};


// 絵文字(あちこちで呼ばれる)
const textTemplates = {
	"msgFollow": "はじめまして$\nお友だち追加ありがとうございます！\nこのアカウントでは最新情報を定期的に配信して参ります。\nどうぞお楽しみに！\n\nメニューが表示されない場合、いったんトーク画面を閉じて再度開いてくださいね$",
	
	"ワイワイ": "こんにちは$\n投稿やライブを楽しみにしててね$",
  
  "tap_richMenuB5": "イベントを楽しむためのグッドマナーです$以下省略$"
};

const emojiMap = {
  "msgFollow": [
      { productId: "5ac21184040ab15980c9b43a", emojiId: "011" },
      { productId: "5ac21184040ab15980c9b43a", emojiId: "154" }
  ],
  "ワイワイ": [
      { productId: "5ac21184040ab15980c9b43a", emojiId: "157" },
      { productId: "5ac21184040ab15980c9b43a", emojiId: "013" }
  ],
  "tap_richMenuB5": [
			{ productId: '5ac1bfd5040ab15980c9b435', emojiId: '001' },
			{ productId: '5ac1bfd5040ab15980c9b435', emojiId: '002' }
  ]
};


module.exports = {
	textMessages,
	mediaMessages,
  textTemplates,
  emojiMap,
  msgA4,
  msgTimeoutAppend,
  msgPostpone
};

