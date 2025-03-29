// 実行コマンド→　node richmenu-manager/resetRichMenu.js

const deleteAllRichMenus = require("./deleteAllRichMenus");
const { bCreateRichMenu } = require("./richMenuHandler");

const ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

// async関数を定義（←これがメイン処理）
async function main() {
  console.log("🔁 リッチメニュー初期化開始");

  await deleteAllRichMenus();
  console.log("🗑️ 既存リッチメニュー削除完了");

  await bCreateRichMenu(ACCESS_TOKEN);
  console.log("✅ リッチメニュー再作成完了");
}

// メイン関数を呼び出す
main();

