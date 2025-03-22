/** GAS版とNode.js版の違い
 GASコード	                   Node.js (Vercel) 用
SpreadsheetApp.openById()	    googleapis.sheets.spreadsheets.get()
sheet.appendRow()	            sheets.spreadsheets.values.append()
sheet.getRange().getValues()	sheets.spreadsheets.values.get()
LockService	                  Node.jsはロック機構がないので工夫が必要
*/

const { google } = require('googleapis');


// /////////////////////////////////////////
// サービスアカウント認証
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

// スプレッドシートIDとシート名
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = 'allUsers';


// /////////////////////////////////////////
// Google Sheets API クライアント作成
async function getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "path/to/your-service-account.json", // GoogleサービスアカウントのJSONファイル
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}


// /////////////////////////////////////////
// スプレッドシートに共通情報を書き込む
// 表示名とユーザアイコンのurlはこの中で取得してセット
async function setSpreadsheet(groupId, userId, replyToken, ACCESS_TOKEN) {
  try {
    // 1. ユーザー情報を取得
    const displayName = await getDisplayName(userId, ACCESS_TOKEN);
    const pictureUrl  = await getPictureUrl(userId, ACCESS_TOKEN);
    const statusMessage = await getStatusMessage(userId, ACCESS_TOKEN);

    // 2. 既存データを取得
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F` // 必要な範囲を指定
    });

    const rows = response.data.values || [];
    let userRowIndex = rows.findIndex(row => row[1] === userId); // 2列目（userId）で検索

    const newRow = [
      groupId || '',
      userId || '',
      displayName || '',
      pictureUrl || '',
      statusMessage || '',
      '' // LINE SHOPは未定義なら空に
    ];

    if (userRowIndex === -1) {
      // 3. 該当ユーザーがいない場合 → appendRow と同じ
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: SHEET_NAME,
        valueInputOption: 'RAW',
        resource: {
          values: [newRow]
        }
      });
      console.log('新規ユーザーを追加しました！');
    } else {
      // 4. 該当ユーザーがいた場合 → 更新
      const rowNumber = userRowIndex + 1; // A1表記は1始まり
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${rowNumber}:F${rowNumber}`,
        valueInputOption: 'RAW',
        resource: {
          values: [newRow]
        }
      });
      console.log('既存ユーザー情報を更新しました！');
    }

    return true;

  } catch (error) {
    console.error('スプレッドシート書き込みエラー:', error.message);
    // 必要なら replyToken でエラー通知
    return false;
  }
}


// /////////////////////////////////////////
// **スプレッドシートからデータを取得**
async function getSheetData() {
  const sheets = await getGoogleSheetClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREAD_SHEET_ID,
    range: SHEET_NAME
  });
  return response.data.values;
}


// /////////////////////////////////////////
// **スプレッドシートにデータを書き込む**
async function writeSheetData(values) {
  const sheets = await getGoogleSheetClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREAD_SHEET_ID,
    range: SHEET_NAME,
    valueInputOption: "RAW",
    resource: { values }
  });
}


module.exports = {
	getGoogleSheetClient,
	setSpreadsheet,
  getSheetData,
  writeSheetData
};
