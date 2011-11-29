var logLevels = {
};
var logFileMap = {
};

function initializeLogSystem(sys, lev) {
    logLevels[sys] = lev;
    logFileMap[sys] = [];
}

initializeLogSystem("general",    0);
initializeLogSystem("graphics2d", 3);
initializeLogSystem("graphics3d", 3);
initializeLogSystem("engine",     3);
initializeLogSystem("log",        3);

function getErrorObject(idx) {
    try { throw Error(""); }
    catch (err) {
        var line = err.stack.split("\n")[idx];
        var idx = line.indexOf("at ");
        line = line.slice(idx + 3);
        idx = line.indexOf(" ");
        err.functionName = line.slice(0, idx);
        line = line.slice(idx + 1);
        idx = line.indexOf(")");
        line = line.slice(1, idx);
        idx = line.lastIndexOf("/");
        line = line.slice(idx + 1);
        idx = line.indexOf(":");
        err.filename = line.slice(0, idx);
        line = line.slice(idx + 1);
        idx = line.indexOf(":");
        err.lineNumber = line.slice(0, idx);
        return err; 
    }
}
function getPrefix(err, sys) {
    var pad = "                    ";
    var file = (err.filename + pad).slice(0, 12);

    return (pad + sys).slice(-10) + "::" + (err.filename + ":" + err.lineNumber + " " + pad).slice(0, 20) + "| ";
}

function getSystemFromFile(file) {
    for (sys in logFileMap) {
        var idx = logFileMap[sys].indexOf(file);
        if (idx >= 0) return sys;
    }
    return "general";
}

function logAttachFile(file, system) {
    var idx = file.lastIndexOf("/");
    var fileStrip = file.slice(idx + 1);
    if (!logFileMap[system]) {
        initializeLogSystem(system, 3);
    }
    logFileMap[system].push(fileStrip);
    Debug.debug("Added " + fileStrip + " to " + system, "log");
}

function shouldLog(system, level) {
    var active = logLevels[system];
    if (!active) active = logLevels.general;
    return active >= level;
}

var Debug = function() {};
Debug.out = function(i_Message, level)
{
    try
    {
        if (level == 0) {
            console.error(i_Message);
        } else {
            console.log(i_Message);
        }
    }
    catch(e)
    {
        return;
    }
}

Debug.log = function(message, system, level) {
    var err;
    if (!level) level = 0;
    if (!system) {
        err = getErrorObject(5);
        system = getSystemFromFile(err.filename);
    }
    if (shouldLog(system, level)) {
        if (!err) err = getErrorObject(5);
        var prefix = getPrefix(err, system);
        Debug.out(prefix + message, level);
    }
}
Debug.error = function(message, system) {
    this.log(message, system, 0);
}
Debug.warn = function(message, system) {
    this.log(message, system, 1);
}
Debug.info = function(message, system) {
    this.log(message, system, 2);
}
Debug.debug = function(message, system) {
    this.log(message, system, 3);
}
Debug.Trace = function(message) {
    this.out(message, -1);
}
