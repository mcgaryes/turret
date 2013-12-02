#! /usr/bin/env node

var _ = require("underscore");
var Turret = require("./turret").Turret;
//var exec = require("child_process").exec;
var spawn = require("child_process").spawn;

if (process.argv.length > 2) {
	var cmd = process.argv[2];
	if (cmd === "create") {
		var nTurret = new Turret();
		nTurret.start();
	} else if (cmd === "run") {
		var pgrm = process.argv[3];
		if (pgrm) {
			console.log("Running", pgrm);
			spawn(pgrm, [], {
				stdio: "inherit"
			}, function(err) {
				console.log(err);
			});
		} else {
			console.log("Pass a program");
		}
	}
} else {
	console.log("Error");
}