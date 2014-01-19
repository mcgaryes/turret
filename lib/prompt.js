var async = require("async");
var _ = require("underscore");
var syncPrompt = require("sync-prompt").prompt;
var strings = require("./strings");
var Logger = require("./logger").Logger;
var colors = require("colors");

/**
 * Simple factory module to present user with prompts defined in the turret templates schema.
 * @param {String} key
 * @param {Object} value
 */
var Prompt = module.exports.Prompt = function Prompt(key, value) {
	this.key = key;
	this.value = value;
	this.description = value.description ? value.description : undefined;
	this.pattern = value.pattern ? value.pattern : undefined;
	this.error = value.error ? value.error : "";
	this.logger = new Logger();
};

/**
 * Performs async prompt functionality
 * @method method
 * @param {Object} answers
 * @param {Function} callback
 */
Prompt.prototype.method = function(answers, callback) {

	// error out if we dont have a proper description
	if (_.isUndefined(this.description)) {
		callback(new Error({
			description: strings.MALFORMED_SCHEMA
		}));
		return;
	}

	// setup callback and answers... on the first function run callback 
	// will be undefined and answers will actually be the callback 
	if (_.isUndefined(callback)) {
		callback = answers;
		answers = {};
	}

	// recursive function to make sure we get the prompt answer the way we want it
	(function prompt() {

		// run the prompt

		var delegate = this;
		var question = "prompt".grey + ":  " + this.description + " ";

		var answer = syncPrompt(question);

		// check that the prompt matches the pattern
		if (this.pattern) {
			if (!answer.match(this.pattern)) {

				// call prompt again if there was an error
				this.logger.error(this.error);
				prompt.call(this);

				return;
			}
		}

		// set the answer to the answers passed and run callback functionality
		answers[this.key] = answer;
		callback(null, answers);

	}).call(this);
};

/**
 * Factory method which returns an array of Prompts based on the prompts
 * object that was passed.
 * @method methodsForPrompts
 * @param {Object} prompt Object containing prompts from schema
 */
Prompt.methodsForPrompts = function methodsForPrompts(prompts) {
	var methods = [];
	var keys = _.keys(prompts);
	var values = _.values(prompts);

	for (var i = 0; i < keys.length; i++) {
		var prompt = new Prompt(keys[i], values[i]);
		methods.push(_.bind(prompt.method, prompt));
	};

	return methods;
};