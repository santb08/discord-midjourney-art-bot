const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("../../creds.json");

const getRows = async (doc_id) => {
  const rowsArray = [];
  const doc = new GoogleSpreadsheet(doc_id);
  await doc.useServiceAccountAuth(creds);
  const userInfo = await doc.loadInfo();
  console.log(userInfo);
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  console.log('[Rows]', rows.length)
  for (i = 0; i < rows.length; i++) {
    const row = {
      id: rows[i].Id,
      command: rows[i].Command,
      tag: rows[i].Tag,
    };
    rowsArray.push(row);
  }

  console.log(rowsArray);
  return rowsArray;
};

module.exports = { getRows };
