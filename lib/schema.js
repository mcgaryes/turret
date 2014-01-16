module.exports = {
	prompt: {
		properties: {
			name: {
				description: "What do you want to call your template?",
				type: "string",
				pattern: /^[a-z_-]+$/,
				message: "Please keep your turret name to contain only 'a-z', '_', or '-'.",
				required: true,
				/*
				// @TODO: look into this a bit more
				yes:{
					exclude: "minimatchexclude"
				}
				*/
			},
			description: {
				description: "What does your template do?",
				required: false
			}
		}
	},
	// @TODO: make this work in the turret client.
	templateChar:"?"
};