module.exports = {
	createDescriptors: function createDescriptors(attrs) {
		var descs = {};
		for (var attr in attrs) {
			descs[attr] = {
				value: attrs[attr]
			};
		}
		return descs;
	}
};