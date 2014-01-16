var prompt = require("prompt");

var Prompt = module.exports.Prompt = function Prompt(logger){
	// prompt.logger = logger;
	prompt.message = "Prompt".white;//"[Turret]".grey;
	prompt.delimiter = ": ";
	return prompt;
};