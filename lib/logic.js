var spawn = require("child_process").spawn;

var _ = require("underscore");
var Turret = require("../turret");
var strings = require("./strings");

var HOME = process.env.HOME + "/.turret";
var schema = require("./schema");

// ============================================================
// === Turret Commands ========================================
// ============================================================

module.exports.init = function init() {

	var StubTurret = Turret.extend({
		schema: schema
	});

	var turret = new StubTurret({
		dirname: __dirname
	});

	try {
		turret.start();
	} catch (e) {
		console.log(e);
	}
};

module.exports.run = function run(args) {
	if (!_.isUndefined(args)) {
		try {
			var dir = HOME + "/node_modules/" + args[1];
			var schema = require(dir);
			var CustomTurret = Turret.extend({
				schema: schema
			});

			var turret = new CustomTurret({
				dirname:dir
			});

			try {
				turret.start();
			} catch (e) {
				console.log(e);
			}

		} catch (e) {

			console.log(strings.NOT_FOUND);
		}
	}
};

// ============================================================
// === NPM Commands ===========================================
// ============================================================

module.exports.install = function install(args) {
	spawn("npm", args, {
		cwd: HOME,
		stdio: "inherit"
	});
};

module.exports.uninstall = function uninstall(args) {
	spawn("npm", args, {
		cwd: HOME,
		stdio: "inherit"
	});
};

module.exports.update = function update(args) {
	spawn("npm", args, {
		cwd: HOME,
		stdio: "inherit"
	});
};