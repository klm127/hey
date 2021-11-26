
var globalConfig = {
    render: "html",
    logger: {
        printer: console.log,
        logFile: "",
        printToConsole: true,
        logLines: []
    },
    debug: {
        on: true
    }
}

function configBuilder(heyGlobal) {

    function cf(funcName, parameter) {
        if(cf.hasOwnProperty(funcName)) {
            cf[funcName](parameter);
        }
    }
    cf.log = logCb(cf);
    cf.log.clear = clearLogCb(cf);
    cf.write = logCb(cf)
    cf.set = {};
    cf.set.render = setRenderCb(cf);
    cf.set.render.to = setRenderCb(cf);
    cf.print = printCb(cf);
    if(heyGlobal.config) {
        globalConfig = heyGlobal.config;

    } else {
        heyGlobal.config = globalConfig;
    }
    cf.config = heyGlobal.config;
    return cf;
}

function logCb(c) {
    return function(text, logLineConfig) {
        c.config.logger.logLines.push({
            text: text,
            time: new Date(),
            logLineConfig: logLineConfig
        })
        return c;
    }
}

function clearLogCb(c) {
    return function() {
        c.config.logger.logLines = [];
        return c;
    }
}

function setRenderCb(c) {
    return function(text) {
        c.config.render = text;
        return c;
    }
}

function printCb(c) {
    return function(specialPrinter) {
        let printer = specialPrinter ? specialPrinter : c.config.logger.printer ? c.config.logger.printer : console.log;
        for(let j of c.config.logger.logLines) {
            printer(`|${j.time.getHours()}:${j.time.getMinutes()}:${j.time.getSeconds()}| : ${j.text} `)
        }
        return c;
    }
}

module.exports = configBuilder;