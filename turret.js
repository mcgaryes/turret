var fs = require("fs");
var exec = require("child_process").exec;

var prompt = require("prompt");
var async = require("async");
var ncp = require("ncp").ncp;
var _ = require("underscore");
var Backbone = require("backbone");

var utils = require("./lib/utils");
var strings = require("./lib/strings");

/**
 * Turret generator
 * @constructor
 * @class
 * @param {Object} options to be applied to the Turret instance
 */
var Turret = module.exports = function Turret(options) {
	if (options) {
		this.dirname = options.dirname ? options.dirname : __dirname;
	}
	return this;
};

Turret.prototype = Object.create(Backbone.Events, {

	/**
	 * provides functionality for prompt and template creation
	 */
	schema: {
		value: {}
	},

	/**
	 * Creates and runs an async waterfall series
	 */
	start: {
		value: function start() {
			console.log("Starting...");
			var delegate = this;
			async.waterfall([
				this.check,
				function(callback) {
					delegate.gather(callback);
				},
				function(result, callback) {
					delegate.combine(result, callback);
				},
				function(result, callback) {
					delegate.create(result, callback);
				},
				this.install
			], this.finish);
		}
	},

	/**
	 * Check to make sure that the current working directory is empty
	 * @param {Function} callback
	 */
	check: {
		value: function check(callback) {
			var files = _.filter(fs.readdirSync(process.cwd()), function(file) {
				// @TODO: Give this a proper whitelist of filenames
				if (file.slice(0, 1) === ".") return false;
				return true;
			});
			if (files.length > 0) {
				callback(strings.NOT_EMPTY);
			} else {
				callback();
			}
		}
	},

	/**
	 * Performs dialog prompts and send the gathered data along
	 * @param {Function} callback Callback functionality for when prompt is complete
	 */
	gather: {
		value: function gather(callback) {
			console.log("Gathering information...");
			if (_.isUndefined(this.schema) || _.isUndefined(this.schema.prompt)) {
				callback(null, {});
			} else {
				prompt.start();
				prompt.get(this.schema.prompt, function(err, result) {
					callback(err, result);
				});
			}
		}
	},

	/**
	 * Combines the content gathered during prompts with the items passed into
	 * the schema's template object
	 */
	combine: {
		value: function combine(result, callback) {
			if (!_.isUndefined(this.schema) && !_.isUndefined(this.schema.template)) {
				callback(null, _.extend(result, this.schema.template));
			} else {
				callback(null, result);
			}
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

			_.templateSettings = {
				evaluate: /<\?([\s\S]+?)\?>/g,
				interpolate: /<\?=([\s\S]+?)\?>/g,
				escape: /<\?-([\s\S]+?)\?>/g
			};

			ncp(this.dirname + "/template", process.cwd(), {
				transform: function(read, write, file) {
					read.on('readable', function() {
						write.write(_.template(String(read.read()), result));
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
		value: function install(callback) {
			console.log("Running install...");
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
				console.log("\nError: " + err);
			} else {
				console.log("Finishing up...");
			}
		}
	}
});

/**
 * Simple extension functionality
 * @param {Object} props Properties to assign to the entention's prototype
 */
Turret.extend = function(props) {
	var parent = this;
	var child = function() {
		parent.apply(this, arguments);
	};
	var proto = utils.createDescriptors(props);
	child.prototype = Object.create(parent.prototype, proto);
	return child;
};