/**
// richMenuIdをげとする方法
const menus = await client.getRichMenuList();

// 返ってくる配列
[
  {
    "richMenuId": "richmenu-xxxxxxxxxxxxxxxxxxxx",
    "name": "menuA",
    "chatBarText": "メニューA",
    ...
  },
  {
    "richMenuId": "richmenu-yyyyyyyyyyyyyyyyyyyy",
    "name": "menuB",
    "chatBarText": "メニューB",
    ...
  }
]
*/


const line = require('@line/bot-sdk');


// LINE Bot SDKの初期設定
const client = new line.Client({
  channelAccessToken: 'ACCESS_TOKEN' // ← 環境変数にしてもOK
});


// リッチメニュー削除処理
async function deleteRichMenusAndAliases() {
  try {
		// リッチメニューIdをげと
		const menus = await client.getRichMenuList();
		
    if (menus.length === 0) {
      console.log('リッチメニューは登録されていません');
      return;
    }
		
    console.log(`取得したリッチメニュー数: ${menus.length}`);
    menus.forEach((menu, index) => {
      console.log(`No.${index + 1}`);
      console.log(`  richMenuId: ${menu.richMenuId}`);
      console.log(`  name      : ${menu.name}`);
      console.log(`  chatBarText: ${menu.chatBarText}`);
      console.log('--------------------------');
    });
    
    
    // 全削除する
    let aRichMenuId, bRichMenuId;
    for (let i = 0; i < menus.length; i++) {
      aRichMenuId = menus[i];
      if (menus.length - i >= 1) { bRichMenuId = menus[i+1]; }
      else                       { bRichMenuId = ""; }
		
		
    // --- デフォルトリッチメニュー解除 ---
    try {
			await client.deleteRichMenu(aRichMenuId);
      console.log('デフォルトリッチメニューAを解除しました');
			
			if (bRichMenuId != "") {
				await client.deleteRichMenu(bRichMenuId);
      	console.log('デフォルトリッチメニューBを解除しました');
			}
			
    } catch (error) {
      console.log('デフォルトリッチメニュー解除スキップ:', error.message);
    }
		
		
    // --- エイリアス削除 ---
    try {
      await client.deleteRichMenuAlias('switch-to-a');
      console.log(`エイリアス 'switch-to-a' を削除しました`);
      
      await client.deleteRichMenuAlias('switch-to-b');
      console.log(`エイリアス 'switch-to-b' を削除しました`);
      
    } catch (error) {
      console.log(`エイリアス削除エラー:`, error.message);
    }
		
    
    // --- リッチメニュー削除 ---
    try {
      await client.deleteRichMenu(aRichMenuId);
      console.log(`リッチメニューの領域を解放し、aRichMenuId を削除しました`);
      
      if (bRichMenuId != "") {
	      await client.deleteRichMenu(bRichMenuId);
  	    console.log(`リッチメニューの領域を解放し、bRichMenuIdを削除しました`);
			}
			
    } catch (error) {
      console.log(`リッチメニュー削除エラー:`, error.message);
    }
    
  } // for文の終わり
		
    console.log('すべてのリッチメニューとエイリアスを削除しました！');
	
  } catch (error) {
    console.log('リッチメニューとエイリアス削除処理エラー:', error.message);
  }
}


module.exports = {
	deleteRichMenusAndAliases
};


