var fs = require("fs");
try {
	fs.mkdirSync(process.env.HOME + "/.turret");
} catch(e) {
	console.log(e);
}