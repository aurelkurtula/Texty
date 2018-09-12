const {ipcRenderer, remote} = require('electron');
const path = require('path')
const { PREFERENCE_SAVE_DATA_NEEDED }  = require(path.resolve('actions/types')) 
const fs = require('fs')
let userDataPath = remote.app.getPath('userData');
let filePath = path.join(userDataPath, 'preferences.json')
let usersStyles =  JSON.parse( fs.readFileSync(filePath) )

for(let style in usersStyles) {
    document.querySelector(`input[name="${style}"]`).value = usersStyles[style]
    document.querySelector(`label[for="${style}"]`).style.backgroundColor = usersStyles[style] // = {'background-color': 'red'}
}

var inputs = document.getElementsByTagName('input')
let preferences = {};
for(var i = 0 ; i < inputs.length; i++){
    document.querySelector(`label[for="${inputs[i].name}"]`).style.backgroundColor = inputs[i].value
    preferences[inputs[i].name] = inputs[i].value
    inputs[i].onkeyup = e => {
        preferences[e.target.name] = e.target.value
        document.querySelector(`label[for="${e.target.name}"]`).style.backgroundColor = e.target.value
        ipcRenderer.send(PREFERENCE_SAVE_DATA_NEEDED, preferences)
    }
}
document.getElementById('defaultValues').addEventListener('click', function(e) { // reset
    e.preventDefault();
    preferences = {};
    for(var i = 0 ; i < inputs.length; i++){
        preferences[inputs[i].name] = inputs[i].defaultValue
        document.querySelector(`label[for="${inputs[i].name}"]`).style.backgroundColor = inputs[i].defaultValue
        inputs[i].value = inputs[i].defaultValue
        ipcRenderer.send(PREFERENCE_SAVE_DATA_NEEDED, preferences)
    }
    
} )


