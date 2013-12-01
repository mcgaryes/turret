"use strict";

<% if (requirejs.slice(0,1) !== "y") { %>
$(function(){
	console.log("ready");
});
<% } else { %>
require.config({
	paths: {
		jquery: "libs/jquery",
		backbone: "libs/backbone",
		underscore: "libs/underscore",
		text: "libs/requirejs-text",
		screens: "view/screens",
		views: "view/views",
		components: "view/components"
	},
	shim: {
		underscore: {
			exports: "_"
		},
		backbone: {
			deps: [
				"underscore",
				"jquery"
			],
			exports: "Backbone"
		}
	}
});

require(["backbone"], function(Backbone) {
	console.log("ready");
});
<% } %>