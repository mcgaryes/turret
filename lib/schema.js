module.exports = {
	prompts: {
		name: {
			description: "What do you want to call your template?",
			pattern: /^[a-z_-]+$/,
			error: "Please keep your turret name to contain only 'a-z', '_', or '-'."
			// minimatch:"exclude such in such files"
		},
		description: {
			description: "What does your template do?"
		}
	}
};