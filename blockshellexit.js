/*block shell from closing*/
require('readline')
	.createInterface(process.stdin, process.stdout)
	.question("Press [Enter] to exit...", function() {
		process.exit();
	});

