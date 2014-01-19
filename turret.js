var fs = require("fs");
var spawn = require("child_process").spawn;
var EventEmitter = require("events").EventEmitter;

var async = require("async");
var ncp = require("ncp").ncp;
var _ = require("underscore");

var prototypeUtils = require("./lib/prototype-utils");
var strings = require("./lib/strings");
var Prompt = require("./lib/prompt").Prompt;
var Logger = require("./lib/logger").Logger;

/**
 * Turret generator
 * @constructor
 * @class
 * @param {Object} options to be applied to the Turret instance
 */
var Turret = module.exports = function Turret(options) {
	this.dirname = options && options.dirname ? options.dirname : __dirname;
	this.cwd = options && options.cwd ? options.cwd : process.cwd();
	this.logger = new Logger(options);
	return this;
};

Turret.prototype = Object.create(EventEmitter.prototype, {

	/**
	 * Provides functionality for prompt and template creation.
	 */
	schema: {
		value: {}
	},

	/**
	 * Creates and runs an async waterfall series.
	 */
	start: {
		value: function start() {
			this.logger.info("Starting...");
			async.waterfall([
				_.bind(this.check, this),
				_.bind(this.gather, this),
				_.bind(this.combine, this),
				_.bind(this.create, this),
				_.bind(this.install, this)
			], _.bind(this.finish, this));
		}
	},

	/**
	 * Check to make sure that the current working directory is empty.
	 * @param {Function} callback
	 */
	check: {
		value: function check(callback) {
			this.logger.info("Checking CWD...");
			// @TODO: think about adding a true whitelist of files to check against
			// run through some different folder scenerios
			var files = _.filter(fs.readdirSync(this.cwd), function(file) {
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
	 * Performs dialog prompts and send the gathered data along.
	 * @param {Function} callback Callback functionality for when prompt is complete
	 */
	gather: {
		value: function gather(callback) {
			this.logger.info("Gathering information...");
			if (_.isUndefined(this.schema) || _.isUndefined(this.schema.prompts)) {
				callback(null, {});
			} else {
				var methods = Prompt.methodsForPrompts(this.schema.prompts);
				async.waterfall(methods, function(err, result) {
					callback(err, result);
				});
			}
		}
	},

	/**
	 * Combines the content gathered during prompts with the items passed into
	 * the schema's template object.
	 * @param {Object} result
	 * @param {Function} callback
	 */
	combine: {
		value: function combine(result, callback) {
			this.logger.info("Combining gathered with schema template...");
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

			this.logger.info("Creating files...");

			var delimiter = this.schema.delimiter ? this.schema.delimiter : "?";

			_.templateSettings = {
				evaluate: new RegExp("<\\" + delimiter + "([\\s\\S]+?)\\" + delimiter + ">", "g"),
				interpolate: new RegExp("<\\" + delimiter + "=([\\s\\S]+?)\\" + delimiter + ">", "g"),
				escape: new RegExp("<\\" + delimiter + "-([\\s\\S]+?)\\" + delimiter + ">", "g")
			};

			ncp(this.dirname + "/template", this.cwd, {
				transform: function(read, write, file) {
					// @TODO: if i answered no and I dont need a file dont move it over
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

			this.logger.info("Running install...");

			var childProc = spawn("npm", ["install"], {
				cwd: this.cwd,
				stdio: "inherit"
			});

			var delegate = this;
			childProc.on("close", function(code) {
				delegate.logger.info("child process exited with code " + code);
			});

		}
	},

	// @TODO: add cleanup method here

	/**
	 * Final wrap-up once project generation is complete
	 * @param {Error} err Error object if somethings gone wrong during control flow
	 */
	finish: {
		value: function finish(err) {
			if (err) this.logger.error(err);
			this.emit("complete", err);
		}
	}
});

/**
 * Static factory method for creating a Turret instance
 * @param {Object} schema The schema to pass through to prompt commands for the instance
 * @param {String} directory The CWD for the turret instance to use for scaffolding
 * @param {String} The current working directory OPTIONAL
 */
var create = Turret.create = function create(options, dirname, cwd) {

	// create an turret extention object
	var ChildTurret = this.extend(options);

	// return a new instance of the extention turret
	return new ChildTurret({
		dirname: dirname,
		cwd: cwd,
	});
};

/**
 * Simple extension functionality
 * @param {Object} props Properties to assign to the entention's prototype
 */
var extend = Turret.extend = function extend(props) {
	var parent = this;
	var child = function() {
		parent.apply(this, arguments);
	};
	child.extend = extend;
	child.create = create;
	var proto = prototypeUtils.createDescriptors(props);
	child.prototype = Object.create(parent.prototype, proto);
	return child;
};