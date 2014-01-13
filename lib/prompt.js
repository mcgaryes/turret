var prompt = require("prompt");

var Prompt = module.exports.Prompt = function Prompt(logger){
	prompt.logger = logger;
	prompt.message = "prompt".magenta;//"[Turret]".grey;
	prompt.delimiter = ": ";
	return prompt;
};