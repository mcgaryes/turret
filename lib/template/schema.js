module.exports = {

	/**
	 * Command line prompts for the end user visit https://npmjs.org/package/prompt
	 * for full documentation on what is possible to 'prompt' the user for.
	 */
	prompt: {
		properties: {}
	},

	/**
	 * Optional property whose contents are passed to the templating functionality
	 * during the file copy and creation phase of generation.
	 */
	template: {},

	/**
	 * If this property is specified we'll use this character for the ERB-style delimiters
	 * used in the templating phase of project scaffolding.
	 */
	delimiter: "?"
	
};