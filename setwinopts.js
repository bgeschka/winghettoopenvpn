const rcedit = require('rcedit')
const fs = require('fs')
//when invoked with nodejs, argv2 is path to exe, argv3 is path to icon
var opts = {
	"requested-execution-level": "requireAdministrator"
};
if(process.argv[3] && fs.existsSync(process.argv[3])) opts.icon = process.argv[3];

rcedit(process.argv[2], opts);
