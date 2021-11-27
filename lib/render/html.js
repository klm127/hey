
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
    fs.writeFile(indexPath, buildHTMLString(hey), (err,fd)=> {
        console.log('write file done')
    })
}

function buildHTMLString(hey) {
    function getCSSStyle(style) {
        if(!style) return '';
        else {
            if(Object.keys(style).length < 1) {
                return '';
            }
            else {
                let sb = "";
                for(let key in style) {
                    let k = key.trim();
                    sb += `${k}:${style[key]};`;
                }
                sb += "";
                return ` style=${sb}`;
            }
        }
    }
    function ind(n) {
        let indent = "";
        for(let i = 0; i < n; i++) {
            indent += "\t";
        }
        return indent;
    }
    function convertToHtml(scaffold, n=0) {
        let str = 
`
${ind(n)}<${scaffold.type} id="${scaffold.name}"${getCSSStyle(scaffold.style)}">
 ${ind(n+1)}${scaffold.content ? scaffold.content : ''}
 `;

        for(let c of scaffold.children) {
            str += convertToHtml(c, n+1);
        }
        str +=
`
${ind(n)}</${scaffold.type}>
`;
        return str;
    }
    let headhtml = 
`<html>
    <head>
    </head>
    <body>
`;
    for(let top of hey.app().children) {
        headhtml += convertToHtml(top,1);
    }
    headhtml += `   </body>\n`;
    headhtml += '<script>\n'
    headhtml += '//script will go here'
    headhtml += '</script></html>'
    return headhtml;
}

module.exports = _htmlRender