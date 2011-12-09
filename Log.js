/* Logging system
 *
 * When LoadjsFile is called, it will associate the loaded file with the logging subsystem
 * given as the second argument. If no second argument is given, the file will inherit the
 * subsystem of the file that that call to LoadjsFile appears in. Each of .error, .warn,
 * .info, .debug allows you to explicitly state the subsystem, but if it isn't provided will
 * simply get it from the file that the call appears in.
 *
 * When a message is sent to the logging system via one of the methods provided, it will be
 * assigned a level. The lower the level, the more important message -- Level 0 is an error,
 * 1 is warning, etc. To explicitly set the level of your message, use Debug.out, otherwise
 * the message will get the natural level assigned to the relevant method (i.e. Debug.error()
 * will have level 0, etc.).
 *
 * Example Usage:
 *   Debug.info("info will appear at level: " + 2);
 *   Debug.debug("Log to 'graphics2d' regardless of what file it is in", "graphics2d");
 *   Debug.warn(obj); // this will log an object in a separate call from the prefix so that you can 
 *       // explore it correctly in the console
 *
 *   Debug.out(message, null, 2); // This will log at level 2
 *
 *   Debug.raw(message); // This will simply call console.log(message) if you want to bypass the logging system
 *
 */
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
initializeLogSystem("interface", 2);
initializeLogSystem("graphics3d", 0);
initializeLogSystem("engine",     3);
initializeLogSystem("log",        0);

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
function getPrefix(err, sys, lvl) {
    var pad = "                    ";
    var file = (err.filename + pad).slice(0, 12);

    return (pad + sys + "(" + lvl + ")").slice(-15) + "::" + (err.filename + ":" + err.lineNumber + " " + pad).slice(0, 20) + "| ";
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
        initializeLogSystem(system, 0);
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
// Don't call this directly
Debug.logInternal = function(prefix, message, level)
{
    try
    {
        if (level == 0) {
            if (typeof(message) == "string") {
                console.error(prefix + message);
            } else {
                console.log(prefix);
                console.error(message);
            }
        } else {
            if (typeof(message) == "string") {
                console.log(prefix + message);
            } else {
                console.log(prefix);
                console.log(message);
            }
        }
    }
    catch(e)
    {
        return;
    }
}

var hasLogged = {};
Debug.once = function() {
    var err = getErrorObject(5);
    var pfx = err.filename + err.lineNumber;
    if (hasLogged[err + pfx]) return false;
    hasLogged[err + pfx] = true;
    return true;
}

Debug.log = function(message, system, level) {
    var err;
    if (!level) level = -1; // should always appear, but not as error
    if (!system) {
        err = getErrorObject(5);
        system = getSystemFromFile(err.filename);
    }
    if (shouldLog(system, level)) {
        if (!err) err = getErrorObject(5);
        var prefix = getPrefix(err, system, level);
        this.logInternal(prefix, message, level);
    }
}
Debug.error = function(message, system) {
    this.log(message, system, 0);
}
Debug.errorOnce = function(message, system) {
    if (this.once()) this.log(message, system, 0);
}
Debug.warn = function(message, system) {
    this.log(message, system, 1);
}
Debug.warnOnce = function(message, system) {
    if (this.once()) this.log(message, system, 1);
}
Debug.info = function(message, system) {
    this.log(message, system, 2);
}
Debug.infoOnce = function(message, system) {
    if (this.once()) this.log(message, system, 2);
}
Debug.debug = function(message, system) {
    this.log(message, system, 3);
}
Debug.debugOnce = function(message, system) {
    if (this.once()) this.log(message, system, 3);
}
Debug.Trace = function(message) {
    this.log(message, null, 1);
}
Debug.out = function(message, system, level) {
    this.log(message, system, level);
}
Debug.raw = function(message) {
    console.log(message);
}
