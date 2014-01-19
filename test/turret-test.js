/*jshint expr: true*/

var expect = require('chai').expect;
var Turret = require("../turret");
var fs = require("fs");
var Logger = require("../lib/logger").Logger;

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


describe("turret", function() {

	it("can be extended", function() {

		var CustomTurret = Turret.extend({
			schema: null
		});

		expect(CustomTurret.extend).to.not.be.undefined;
		expect(CustomTurret.create).to.not.be.undefined;

		var turret = new CustomTurret({
			dirname: __dirname,
			logsilent: true
		});

		expect(turret.schema).to.equal(null);
	});

	it("throws an error if working directory is not empty", function(done) {
		var CustomTurret = Turret.extend({
			finish: function(err) {
				expect(err).to.not.be.undefined;
				done();
			}
		});
		var turret = new CustomTurret({
			logsilent: true
		});
		turret.start();
	});

	it("skips gather if schema is undefined", function(done) {

		var CustomTurret = Turret.extend({
			schema: undefined,
			check: function(callback) {
				callback();
			},
			create: function(result, callback) {
				expect(Object.keys(result).length).to.equal(0);
				done();
			}
		});

		var turret = new CustomTurret({
			dirname: __dirname,
			logsilent: true
		});

		turret.start();
	});

	it("methods all get called", function(done) {
		var i = 0;
		var CustomTurret = Turret.extend({
			schema: undefined,
			check: function(callback) {
				i++;
				callback();
			},
			gather: function(callback) {
				i++;
				callback(null, {});
			},
			combine: function(result, callback) {
				i++;
				callback(null, {});
			},
			create: function(result, callback) {
				i++;
				callback();
			},
			install: function(callback) {
				i++;
				callback();
			},
			finish: function() {
				i++;
				expect(i).to.equal(6);
				done();
			}
		});

		var turret = new CustomTurret({
			dirname: __dirname,
			logsilent: true
		});

		turret.start();
	});

	it("schema is passed into tempaltes", function(done) {
		var Custom = Turret.extend({
			schema: {
				prompt: {},
				template: {
					foo: "bar"
				}
			},
			check: function(callback) {
				callback();
			},
			gather: function(callback) {
				callback(null, {});
			},
			create: function(result, callback) {
				expect(result.foo).to.equal("bar");
				done();
			},
		});

		var t = new Custom({
			logsilent: true
		});
		t.start();
	});

	it("can set cwd", function() {
		var turret = new Turret({
			cwd: "foo",
			logsilent: true
		});
		expect(turret.cwd).to.equal("foo");
	});

	describe("templating", function() {
		it("prompts", function() {
			// ...
		});
	});

	describe("schema template character", function() {

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

		it("is used as defined", function(done) {

			var Custom = Turret.extend({
				install: function(callback) {
					callback();
				}
			})

			var custom = Custom.create({
				schema:{
					delimiter: "abc",
					template: {
						foo: "bar"
					}
				}
			}, tmpReadPath, tmpWritePath);

			custom.logger = new Logger({
				logsilent:true
			});

			custom.on("complete", function() {
				var result = String(fs.readFileSync(tmpWritePath + "/foo"));
				expect(result).to.equal("bar");
				done();
			});

			custom.start();


		});
	});
});