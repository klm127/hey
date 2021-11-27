
var globalConfig = {
    render: "html",
    output_directory: "./out",
    launch_directory: undefined, // added at runtime
    logger: {
        printer: console.log,
        logFile: "",
        printToConsole: true,
        logLines: [],
        logDirectory: "",
    },
    debug: {
        on: true
    }
}

function configBuilder(heyGlobal) {
    Object.assign(globalConfig, heyGlobal);
    function cf(funcName, parameter) {
        if(cf.hasOwnProperty(funcName)) {
            return cf[funcName](parameter);
        }
    }
    cf.log = logCb(cf);
    cf.log.clear = clearLogCb(cf);
    cf.write = logCb(cf)
    cf.set = setSpecificCb(cf);
    cf.set.render = setRenderCb(cf);
    cf.set.render.to = setRenderCb(cf);
    cf.print = printCb(cf);
    cf.config = globalConfig;
    cf.get = getSpecificCb(cf);
    cf.get.config = getConfig(cf);
    return cf;
}

function getSpecificCb(c) {
    return function(key1, key2) {
        if(!key1) return c.get.config();
        let prop = c.config[key1];
        if(key2) prop = prop[key2];
        if(!prop) c.log(`config couldn't find property ${key1}.${key2?key2:''}`);
        return prop;
    }
}
function setSpecificCb(c) {
    return function(key1, val, third) {
        try {
            if(third) {
                c.config[key1][val] = third;
            } else {
                c.config[key1] = val;
            }
            return c;
        } catch(e) {
            c.log(`invalid config set: ${key1}${val}${third?third:''}`)
        }
    }
}

function getConfig(c) {
    return function() {
        return c.config;
    }
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
        return "log printed";
    }
}

module.exports = configBuilder;