// ============================================================
// === Module Requirements ====================================
// ============================================================

var spawn = require("child_process").spawn;
var fs = require("fs");

var _ = require("underscore");
var Turret = require("../turret");

// ============================================================
// === Module Consts and Vars =================================
// ============================================================

const STRINGS = require("./strings");
const HOME = process.env.HOME + "/.turret";
const SCHEMA = require("./schema");

// ============================================================
// === Helper Functionality ===================================
// ============================================================

function isValidTurret(module) {
	return true;
	/*
	if (module.search("turret-") > -1) return true;
	return false;
	*/
}

// ============================================================
// === Command Line Functionality =============================
// ============================================================

var commands = module.exports = {

	// ============================================================
	// === Turret Execution Commands ==============================
	// ============================================================

	/**
	 * Initialize a new turret template stub for development.
	 * @param {Array} args Command line arguments
	 */
	init: function init(args) {
		try {
			Turret.create(SCHEMA, __dirname).start();
		} catch (e) {
			console.log(e);
		}
	},

	/**
	 * Build a turret from a specified turret generator. If the specified turret is not
	 * installed then install it first before running it. This method also removes uneeded
	 * .turret files from empty directories.
	 * @param {Array} args Command line arguments
	 */
	build: function build(args) {

		if (args.length >= 2 && isValidTurret(args[1])) {

			// @TODO: Need to install the turret if is not there on build
			// strip empty .turret files

			var dir = HOME + "/node_modules/" + args[1];
			try {
				Turret.create(require(dir), dir).start();
				// remove the .turret files from the directory structure
			} catch (e) {
				console.log(e);
			}

		} else {

			console.error(STRINGS.USAGE);

		}
	},

	// ============================================================
	// === NPM Mirrored Commands ==================================
	// ============================================================

	/**
	 * Installs a turret generator from npm into the .turret directory.
	 * @param {Array} args Command line arguments
	 */
	install: function install(args) {

		// remove .empty files from the directories 

		if (args.length >= 2 && isValidTurret(args[1])) {
			var proc = spawn("npm", args, {
				cwd: HOME,
				stdio: "inherit"
			});
		} else {
			console.error(STRINGS.USAGE);
		}
	},

	/**
	 * Uninstalls a turret generator from the .turret directory. See
	 * npmjs.org documentation for more details.
	 * @param {Array} args Command line arguments
	 */
	uninstall: function uninstall(args) {
		spawn("npm", args, {
			cwd: HOME,
			stdio: "inherit"
		});
	},

	/**
	 * Updates a turret from npm. See npmjs.org documentation for more details.
	 * @param {Array} args Command line arguments
	 */
	update: function update(args) {
		spawn("npm", args, {
			cwd: HOME,
			stdio: "inherit"
		});
	},

	/**
	 * Publishes a turret to npm and fixes some minor things to allow for
	 * empty folder and naming conventions to be applied
	 */
	publish: function publish(args) {
		// check that name from package.json has a turret- in front of it
		// throw .empty files into empty directories
		throw new Error("Not yet implemented");
	}
};

// ============================================================
// === Asynchronous Functionality =============================
// ============================================================