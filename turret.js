var fs = require("fs");
var exec = require("child_process").exec;

var colors = require("colors");
var prompt = require("prompt");
var async = require("async");
var ncp = require("ncp").ncp;
var _ = require("underscore");
var log = require("custom-logger");

log.config({
	format: "[%event% %timestamp%]%padding%%message%"
}, {
	timestamp: "h:MM:ss"
});

var Turret = function Turret(options) {
	this.dirname = options.dirname ? options.dirname : __dirname;
};

Turret.prototype = Object.create({}, {

	/**
	 * Creates and runs an async waterfall series
	 */
	start: {
		value: function start() {
			log.info("Starting...");
			var delegate = this;
			async.waterfall([

				function(callback) {
					delegate.load(callback);
				},
				this.gather,
				function(result, callback) {
					delegate.create(result, callback);
				},
				this.install
			], this.finish);
		}
	},

	/**
	 * Loads the schema for the console dialog prompts
	 * @see https://npmjs.org/package/prompt for json schema direction
	 * @param {Function} callback Callback functionality for when schema is done loading
	 */
	load: {
		value: function(callback) {
			log.info("Loading schema...");
			var path = this.dirname + "/schema.json";
			fs.exists(path, function(exists) {
				if (exists) {
					fs.readFile(path, function(err, data) {
						callback(err, JSON.parse(String(data)));
					});
				}
			});
		}
	},

	/**
	 * Performs dialog prompts and send the gathered data along
	 * @param {Object} schema js object
	 * @param {Function} callback Callback functionality for when prompt is complete
	 */
	gather: {
		value: function gather(schema, callback) {
			log.info("Gathering preferences...");
			_.each(_.keys(schema.properties), function(key) {
				var obj = schema.properties[key];
				if (obj.validator) obj.validator = new RegExp(obj.validator);
			});
			prompt.start();
			prompt.get(schema, function(err, result) {
				callback(err, result);
			});
		}
	},

	/**
	 * Creates directories and performs _.template replacement with result data
	 * @param {Object} result Resulting js object of prompt
	 * @param {Function} callback Callback functionality directory copy is complete
	 */
	create: {
		value: function create(result, callback) {
			log.info("Creating files...");
			ncp(this.dirname + "/template", process.cwd(), {
				transform: function(read, write, file) {
					read.on('readable', function() {
						if (_.isNull(file.name.match(/.tmpl/i))) {
							write.write(_.template(String(read.read()), result));
						}
						read.pipe(write);
					});
				}
			}, function(err) {
				callback(err);
			});
		}
	},

	/**
	 * Installs components for the project
	 * @param {Function} callback Callback when install is complete
	 */
	install: {
		value: function finish(callback) {
			log.info("Installing components...");
			exec(["npm install"].join("&&"), {
				cwd: process.cwd()
			}, function(err, stdout, stderr) {
				callback(err);
			});
		}
	},

	/**
	 * Final wrap-up once project generation is complete
	 */
	finish: {
		value: function finish(err) {
			if (err) {
				log.error(err);
			} else {
				log.info("Finishing up...");
				log.info("Complete!");
			}
		}
	}
});

module.exports = {
	Turret: Turret,
	log: log
};