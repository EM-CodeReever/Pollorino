// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, Tray } = require('electron')
const path = require('path')
let cloneWindow = null
let tray = null
app.disableHardwareAcceleration()  
const gotTheLock = app.requestSingleInstanceLock()
    
if (!gotTheLock) {
  app.quit()
} else {
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    minWidth: 700,
    minHeight: 540,
    width: 1280,
    height: 720,
    icon: path.join(__dirname + '\\src\\images\\icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    }
  })
  mainWindow.removeMenu(true)
  // and load the index.html of the app.
  mainWindow.loadFile('src/Home/home.html')

  app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname + '\\src\\images\\icon.ico'))
    tray.on("click",function(){
      mainWindow.show()
    })
    const contextMenu = Menu.buildFromTemplate([
        { role: 'about' },
        { type: 'separator' },
        { role: 'toggleDevTools', click: function(){mainWindow.webContents.isDevToolsOpened() ? mainWindow.webContents.closeDevTools() : mainWindow.webContents.openDevTools()}},
        { type: 'separator' }, 
        { role: 'hide', click : function(){mainWindow.hide()} },
        { role: 'unhide', click : function(){mainWindow.show()} },
        { type: 'separator' },
        { role: 'quit' }
    ])
    tray.setToolTip('Pollorino')
    tray.setContextMenu(contextMenu)
  })

    cloneWindow = mainWindow
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (cloneWindow) {
        if (cloneWindow.isMinimized()) cloneWindow.restore()
        cloneWindow.focus()
      }
    })
  //Open the DevTools.
  mainWindow.webContents.openDevTools({mode: 'detach'})
  }
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
  })
}