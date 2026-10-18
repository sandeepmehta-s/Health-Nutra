function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(d.type) || ss.insertSheet(d.type);
  if (sh.getLastRow() === 0) sh.appendRow(Object.keys(d.data));
  sh.appendRow(Object.values(d.data));
  return ContentService.createTextOutput("ok");
}
