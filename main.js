const electron = require('electron');
const{autoUpdater} = require('electron');
const isDev = require('electron-is-dev');
// const logger = require('electron-log');
 

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url')
const {installApplicationMenu} = require('./js/MenuInstaller')

//Setup Logger
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

//Setup Update Events

autoUpdater.on('checking-for-update', () => {
  console.log('checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  console.log('updates available');
  console.log('Version', info.version);
  console.log('release date', info.releaseDate);
});

autoUpdater.on('update-not-available', () => {
  console.log('updates not available');
});

autoUpdater.on('download-progress', (process) => {
  console.log(`progress ${Math.floor(process.percent)}`);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('update downloaded');
  autoUpdater.quitAndInstall();
});

autoUpdater.on('error', () => {
  console.log('error');
});

let win;
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  
  // and load the index.html of the app.
  // win.loadFile('index.html')
  win.loadURL(url.format({
    pathname:path.join(__dirname, 'index.html'),
    protocol:'file',
    slashes:true
  }))
  
  // Open the DevTools.
  win.webContents.openDevTools();
  

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', function(){
  if(!isDev){
    autoUpdater.checkForUpdates();
  }
  createWindow();
  installApplicationMenu();
  
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
