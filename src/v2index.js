const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const AutoLaunch = require('auto-launch');
const fs = require("fs");
var configFilePath = app.getPath("userData") + "\\Local Storage" + "\\config.json"
let cloneWindow = null

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  const createWindow = () => {
    const mainWindow = new BrowserWindow({
      minWidth: 700,
      minHeight: 540,
      width: 1280, 
      height: 745, 
      icon:'src/images/icon.ico',
      frame: false,
      backgroundColor: '#FFF',
      webPreferences: {
          backgroundThrottling: false,
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true
      },
    });
    mainWindow.removeMenu(true)
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes : true
  }));
    //To prevent Second instance
    cloneWindow = mainWindow;
    app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
      if (cloneWindow) {
        if (cloneWindow.isMinimized()){
          cloneWindow.restore()
          cloneWindow.focus()
        }else if (cloneWindow.isMaximized()){
          cloneWindow.focus()
        }else{
          cloneWindow.maximize()
          cloneWindow.restore()
          cloneWindow.focus()
        }
      }
    })
    // Open the DevTools.
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  };
  fs.readFile(configFilePath,"utf-8",(err,jsonString) => {
    if(err){
      console.log(err)
    }else{
  
      var Settings = JSON.parse(jsonString)
  
  app.on('ready', () => {
    let autoLaunch = new AutoLaunch({
      name: 'Pollorino',
      path: app.getPath('exe'),
    });
    if (!Settings.Auto_Launch){autoLaunch.disable()}else{autoLaunch.enable()};
    autoLaunch.isEnabled().then((isEnabled) => {
      if (!isEnabled) autoLaunch.enable();
    });
  });
  
  }
  })
  app.on("ready",createWindow)
}
app.setAppUserModelId(" ")
