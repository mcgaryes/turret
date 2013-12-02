var fs = require("fs");
var exec = require('child_process').exec;

var prompt = require("prompt");
var async = require("async");
var ncp = require('ncp').ncp;
var _ = require("underscore");

var Turret = module.exports = function Turret(options) {};

Turret.prototype = Object.create({}, {

	/**
	 * Creates and runs an async waterfall series
	 */
	start: {
		value: function start() {
			console.log("Starting...");
			async.waterfall([this.load, this.gather, this.create, this.install], this.finish);
		}
	},

	/**
	 * Loads the schema for the console dialog prompts
	 * @see https://npmjs.org/package/prompt for json schema direction
	 * @param {Function} callback Callback functionality for when schema is done loading
	 */
	load: {
		value: function(callback) {
			console.log("Loading schema...");
			var path = process.cwd() + "/schema.json";
			fs.exists(path, function(exists) {
				if (!exists) path = __dirname + "/schema.json";
				fs.readFile(path, function(err, data) {
					callback(err, JSON.parse(String(data)));
				});
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
			console.log("Gathering preferences...");
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
			console.log("Creating files...");
			ncp(__dirname + "/template", process.cwd(), {
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
			console.log("Installing components...");
			exec(["npm install", "bower install", "grunt install", "grunt compile"].join("&&"), {
				cwd: process.cwd(),
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
				console.log("Error:", err.message);
			} else {
				console.log("Finishing up...");
				console.log("Complete");
			}
		}
	}
});