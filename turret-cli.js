#! /usr/bin/env node

var _ = require("underscore");
var logic = require("./lib/logic");
var strings = require("./lib/strings");

if (process.argv.length > 2) {
	var cmd = process.argv[2];
	var args = process.argv.slice(2, process.argv.length);
	if (_.isFunction(logic[cmd])) {
		logic[cmd](args);
	} else {
		console.log(strings.USAGE);
	}
} else {
	console.log(strings.USAGE);
}