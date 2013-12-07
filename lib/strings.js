module.exports = {
	USAGE: ["",
		"Usage: turret <command> [program]",
		"",
		"Where <command> is one of:",
		"\ninit, run, install, uninstall, link, unlink",
		"",
		"Where [program] is a globally installed turret node package",
		""
	].join("\n"),
	NOT_EMPTY:"Working directory is not empty",
	NOT_FOUND:"The turrent referenced is not installed. Run 'turret' for help."
};