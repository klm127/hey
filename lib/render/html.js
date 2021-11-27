
const fs = require('fs');
const path = require('path');


function _htmlRender(hey, specificPath) {
    let outDir;
    let config = hey.config.get();
    if(specificPath) {
        if(path.isAbsolute(specificPath)) outDir = specificPath
        else outDir = path.join(config.launch_directory, specificPath);
    }
    else {
        if(path.isAbsolute(config.output_directory)) outDir = config.output_directory;
        else outDir = path.join(config.launch_directory, config.output_directory);
    }
    let log = console.log;
    log('html render started.');
    fs.access( outDir, (er)=> {
        if(er) {
            fs.mkdir(outDir, (er)=> {
                if(er) {log(`failed to make ${outDir}! Check rw acces.`); throw(er)}
                log(`created ${outDir}`);
                buildFiles(hey, outDir);
            })
        } else {
            buildFiles(hey, outDir);
        }
    })    
}

function buildFiles(hey, outDir) {
    let indexPath = path.join(outDir, 'index.html');
    fs.writeFile(indexPath, "<html></html>", (err,fd)=> {
        console.log('write file done')
    })
}

module.exports = _htmlRender