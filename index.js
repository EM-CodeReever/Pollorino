// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, Tray } = require('electron')
const path = require('path')

let tray = null
app.disableHardwareAcceleration()

const createWindow = () => {
  // Create the browser window.
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
  mainWindow.loadFile('src/index.html')

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
  // Open the DevTools.
  //mainWindow.webContents.openDevTools({mode: 'detach'})
  mainWindow.webContents.isDevToolsOpened()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.