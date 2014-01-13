var fs = require("fs");

try {
	console.log("trying to make folder");
	fs.mkdirSync(process.env.HOME + "/.turret");
} catch(e) {
	console.log(e);
}