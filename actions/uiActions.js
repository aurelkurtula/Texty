const fs = require('fs')

let readFileContentOnClick = function(dir, el){
    el.addEventListener('click', function(e){ // clicking on sidebar titles
        fs.readFile(dir, (err, data) => {
        if (err) throw err;
        fileDir = dir;
        document.getElementById('content').innerHTML = data;
        });
    })
}

const handleNewFile = function(form, dir, content){ 
    let fileName =form.target[0].value
    form.target.classList.remove('show')
    let elChild = document.createElement('li')
    elChild.innerText = fileName
    readFileContentOnClick(dir, elChild) // read file on click
    form.target[0].value = ''
    form.target.parentNode.insertBefore(elChild,form.target.nextSibling);
    document.getElementById('content').innerHTML = content;
}
const readTitles = function(dataURL){ 
    let titles = []
    fs.readdirSync(dataURL).forEach((file, i) => {
        if(file.split('.md').length==2){
            titles.push({
                title: `${file.split('.md')[0]}`, 
                dir: `${dataURL}/${file}` 
            })
        }
    })
   return titles
}

module.exports = {
    readTitles,
    handleNewFile
};





