const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
let window = null
let devtools = null 
app.on('ready', function(){
    devtools = new BrowserWindow()
    window = new BrowserWindow({ x: 0, y: 0, width:800, height:600})
    window.loadURL(path.join('file://', __dirname, 'static/index.html'))
    window.webContents.setDevToolsWebContents(devtools.webContents)
    window.webContents.openDevTools({mode: 'detach'})
    window.webContents.once('did-finish-load', function () {   
        let windowBounds = window.getBounds();  
        devtools.setPosition(windowBounds.x + windowBounds.width, windowBounds.y);
    });
    window.on('move', function () { 
        let windowBounds = window.getBounds();
        devtools.setPosition(windowBounds.x + windowBounds.width, windowBounds.y);
    });
    
})
app.on('close', function() {
    window = null
})




