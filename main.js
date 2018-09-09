const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { WRITE_NEW_FILE_NEEDED, NEW_FILE_WRITTEN, SAVE_NEEDED } = require('./actions/types')
const menu = require('./components/Menu')
let window = null
let devtools = null 

app.on('ready', function(){
    devtools = new BrowserWindow()
    window = new BrowserWindow({ x: 0, y: 0, width:800, height:600})
    window.setTitle('Texty')
    window.loadURL(path.join('file://', __dirname, 'static/index.html'))
    Menu.setApplicationMenu(menu(window))

    window.webContents.setDevToolsWebContents(devtools.webContents)
    window.webContents.openDevTools({mode: 'detach'})
    window.webContents.once('did-finish-load', function () {   
        let windowBounds = window.getBounds();  
        devtools.setPosition(windowBounds.x + windowBounds.width, windowBounds.y);
    });

    ipcMain.on(WRITE_NEW_FILE_NEEDED, (event, {dir}) => {
       fs.writeFile(dir, `Start editing ${dir}`, function(err){
           if(err){
               return console.log('error is writing new file')
           }
           window.webContents.send(NEW_FILE_WRITTEN, `Start editing ${dir}`)
       });
    })

    // Set the devtools position when the parent window is moved.
    window.on('move', function () { 
        let windowBounds = window.getBounds();
        devtools.setPosition(windowBounds.x + windowBounds.width, windowBounds.y);
    });

    
})
app.on('close', function() {
    window = null
})









