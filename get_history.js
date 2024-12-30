const fs = require('fs');
const firebaseAdmin = require('firebase-admin');

// Firebase Admin SDKの初期化
const serviceAccount = require('./chrome-history-database-firebase-adminsdk-qwzgj-59b67501ec.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://chrome-history-database-default-rtdb.firebaseio.com'
});

const db = firebaseAdmin.database();

// データベースから履歴データを取得
const ref = db.ref('history');
console.log('Fetching data from Firebase...');
ref.once('value', (snapshot) => {
  console.log('Data fetched from Firebase.');
  const historyData = snapshot.val();
  if (!historyData) {
    console.log('No data found in Firebase.');
    return;
  }

  console.log('Transforming data...');
  // 日付型に変換
  const historyItems = Object.values(historyData).map(item => ({
    title: item.title,
    url: item.url,
    lastVisitTime: new Date(item.lastVisitTime)
  }));

  console.log('Converting data to text...');
  // テキストに変換してファイルに保存
  const historyText = historyItems.map(item => 
    `Title: ${item.title}\nURL: ${item.url}\nLast Visit Time: ${item.lastVisitTime}\n`
  ).join('\n');

  console.log('Appending data to history.txt...');
  fs.appendFile('history.txt', historyText + '\n', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('History data appended to history.txt');
    }
  });
}, (errorObject) => {
  console.error('The read failed:', errorObject.code);
});