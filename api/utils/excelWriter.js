const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// __dirname はこのファイル（excelWriter.js）がある場所
// "../" で1つ上の line-vercel-bot-public2 に上がる
const EXCEL_PATH = path.resolve(__dirname, "../data.xlsx");
const HEADER = ["groupId", "userId", "displayName", "pictureUrl", "statusMessage"];

function ensureWorkbook() {
  if (!fs.existsSync(EXCEL_PATH)) {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet([HEADER]);
    XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
    XLSX.writeFile(workbook, EXCEL_PATH);
  }
  return XLSX.readFile(EXCEL_PATH);
}

function writeUserDataToExcel(groupId, userId, displayName, pictureUrl, statusMessage) {
  const workbook = ensureWorkbook();
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const userIdIndex = data[0].indexOf("userId");
  const newRow = [groupId, userId, displayName, pictureUrl, statusMessage];

  let foundIndex = data.findIndex((row, idx) => idx > 0 && row[userIdIndex] === userId);

  if (foundIndex === -1) {
    data.push(newRow);
  } else {
    data[foundIndex] = newRow;
  }

  const newSheet = XLSX.utils.aoa_to_sheet(data);
  workbook.Sheets[workbook.SheetNames[0]] = newSheet;
  XLSX.writeFile(workbook, EXCEL_PATH);
}

module.exports = {
  writeUserDataToExcel,
};
