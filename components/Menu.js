const {app, Menu, ipcMain } = require('electron')
const { NEW_DOCUMENT_NEEDED, SAVE_NEEDED, SAVED } = require('../actions/types')
const fs = require('fs')
let contentToSave = ''
ipcMain.on(SAVE_NEEDED, (event, content) => {
    contentToSave = content 
})

module.exports = function(window){
    return Menu.buildFromTemplate([
        {
            label: app.getName(),
            submenu: [
                { label: `Hello`, click: () => console.log("Hello world") }
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
                            fs.writeFile(contentToSave.fileDir, contentToSave.content, (err) => {
                                if (err) throw err;
                                window.webContents.send(SAVED, 'File Saved')
                            });
                        }
                    },
                    accelerator: 'cmd+S'
                }
            ]
        }
        
    ])    
}
