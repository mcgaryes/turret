#! /usr/bin/env node

var _ = require("underscore");
var exec = require('child_process').exec;

var pgrm = process.argv[2];
if (!_.isUndefined(pgrm)) {
	exec(pgrm);
} else {
	console.log("Error:", "You must provide a program.");
}