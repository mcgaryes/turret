/*jshint expr: true*/

var expect = require('chai').expect;
var fs = require("fs");
var logic = require

var rmDirRecursive = function(path) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file, index) {
			var curPath = path + "/" + file;
			if (fs.statSync(curPath).isDirectory()) { // recurse
				rmDirRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};

describe("turret cli", function() {

	var tmpReadPath = __dirname + "/.tmp-read";
	var tmpWritePath = __dirname + "/.tmp-write";
	var tmpData = "<abc= foo abc>";

	beforeEach(function() {
		if (fs.existsSync(tmpReadPath)) rmDirRecursive(tmpReadPath);
		if (fs.existsSync(tmpWritePath)) rmDirRecursive(tmpWritePath);
		fs.mkdirSync(tmpReadPath);
		fs.mkdirSync(tmpReadPath + "/template");
		fs.mkdirSync(tmpWritePath);
		fs.writeFileSync(tmpReadPath + "/template/foo", tmpData)
	});

	afterEach(function() {
		rmDirRecursive(tmpReadPath);
		rmDirRecursive(tmpWritePath);
	});

	describe("scaffold command",function(){

		it("completes when template isn't installed",function(){

		});

		it("errors out when template isn't found",function(){

		});

	});

	describe("publish command",function(){
		
		it("shows warnings for empty folders",function(){

		});

	});

});