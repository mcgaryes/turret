/*jshint expr: true*/

var expect = require('chai').expect;
var Turret = require("../turret");

describe("turret", function() {

	it("can be extended", function() {

		var CustomTurret = Turret.extend({
			schema: null
		});

		var turret = new CustomTurret({
			dirname: __dirname
		});

		expect(turret.schema).to.equal(null);
	});

	it("throws an error if working directory is not empty", function(done) {
		var CustomTurret = Turret.extend({
			finish:function(err){
				expect(err).to.not.be.undefined;
				done();
			}
		});
		var turret = new CustomTurret();
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
			dirname: __dirname
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
			dirname: __dirname
		});

		turret.start();
	});

	it("schema is passed into tempaltes", function(done) {
		var Custom = Turret.extend({
			schema: {
				prompt: {
				},
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

		var t = new Custom();
		t.start();
	});

});