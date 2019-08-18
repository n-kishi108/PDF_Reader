// Electronの読み込み
let electron = require('electron');
let app = electron.app;
let BrowserWindow = electron.BrowserWindow;

// mainWindow変数の初期化
let mainWindow = null;

// MacOS(darwin)でない場合にはアプリを終了する
app.on('window-all-closed', function() {
  if(process.platform != 'darwin') app.quit();
});

// 画面を表示．index.htmlを読み込む
// Close処理を行う
app.on('ready', function() {
  // 画面表示
  mainWindow = new BrowserWindow({
      width: 800,
      height: 800,
      webPreferences: {
        plugins: true
      }
    });
  mainWindow.setTitle('PDF Watcher')
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});