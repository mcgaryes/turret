module.exports = {
	prompt: {
		properties: {
			name: {
				description: "Name of your generator",
				type: "string",
				pattern: /^[a-z_-]+$/,
				message: "Name must be only a-z, _, or -",
				required: true
			},
			description: {
				description: "Description of your generator",
				type: "string",
				required: false,
				default:""
			},
			homepage: {
				description: "Homepage of your generator",
				type: "string",
				pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
				message: "Homepage must be a proper URL",
				required: false
			}
		}
	}
};