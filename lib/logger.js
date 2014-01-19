var winston = require("winston");

const CONFIG = {
    levels: {
        silly: 0,
        verbose: 10,
        input: 15,
        info: 20,
        data: 30,
        warn: 40,
        debug: 50,
        error: 60
    },
    colors: {
        silly: "magenta",
        verbose: "cyan",
        info: "green",
        data: "grey",
        warn: "yellow",
        debug: "blue",
        error: "red",
        input: "magenta"
    }
};

module.exports.Logger = function Logger(options) {

    var logger = new(winston.Logger)({
        transports: [
            new(winston.transports.Console)({
                colorize: true,
                timestamp:false,
                level: options && options.loglevel ? options.loglevel : "verbose",
                silent: options && options.logsilent ? options.logsilent : false
            })
        ],
        levels: CONFIG.levels,
        colors: CONFIG.colors
    });

    logger.cli();

    return logger;
};