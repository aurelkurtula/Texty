const {app, Menu, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const { NEW_DOCUMENT_NEEDED, SAVE_NEEDED, SAVED, PREFERENCE_SAVE_DATA_NEEDED,PREFERENCE_SAVED } = require('../actions/types')
const fs = require('fs')
let contentToSave = ''
ipcMain.on(SAVE_NEEDED, (event, content) => {
    contentToSave = content 
})
let inputs;
ipcMain.on(PREFERENCE_SAVE_DATA_NEEDED, (event, preferences) => {
    inputs = preferences
})

module.exports = function(window){
    return Menu.buildFromTemplate([
        {
            label: app.getName(),
            submenu: [
                {
                    label: 'Preferences',
                    accelerator: 'cmd+,', // shortcut
                    click: _ => {
                        const htmlPath = path.join('file://', __dirname, '../static/preferences.html')
                        let prefWindow = new BrowserWindow({ y: 200, x:200, width: 500, height: 300, resizable: false })
                        prefWindow.loadURL(htmlPath)
                        prefWindow.show()
                       //let devtools = new BrowserWindow()
   // prefWindow.webContents.setDevToolsWebContents(devtools.webContents)
    //prefWindow.webContents.openDevTools({mode: 'detach'})
                        prefWindow.on('close', function () {
                            prefWindow = null 
                            userDataPath = app.getPath('userData');
                            filePath = path.join(userDataPath, 'preferences.json')
                            inputs && fs.writeFileSync(filePath, JSON.stringify(inputs));
                            window.webContents.send(PREFERENCE_SAVED, inputs); 
                       })
                        
                    },
                },
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {label: 'Undo', role: 'undo'  },
                {label: 'Redo', role: 'redo'  },
                {label: 'Cut', role: 'cut'  },
                {label: 'Copy', role: 'copy'  },
                {label: 'Paste', role:'paste'  },
            ]
        },
        {
            label: 'Custom Menu', 
            submenu: [
                {
                    label: 'New',
                    accelerator: 'cmd+N',
                    click: () => {
                        // message recied at ./static/scripts/index.js
                        window.webContents.send(NEW_DOCUMENT_NEEDED, 'Create new document')
                    }
                },
                {
                    label: 'Save',
                    click: () => {
                        
                        if(contentToSave != ''){
                            if(contentToSave != ''){
                                fs.writeFile(contentToSave.fileDir, contentToSave.content, (err) => {
                                    if (err) throw err;
                                    window.webContents.send(SAVED, 'File Saved')
                                });
                            }
                        }
                    },
                    accelerator: 'cmd+S'
                }
            ]
        }
        
    ])    
}