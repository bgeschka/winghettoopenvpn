const {
	execFile,
	spawn
} = require('child_process');
const fs = require('fs');
const remotelog = require('./remotelog.js');


function _exec(cmd, args) {
	return new Promise((resolve, reject) => {
		execFile(cmd, args, (error, stdout, stderr) => {
			if (error) {
				remotelog.error(stderr);
				reject(stderr);
				return;
			}
			resolve(stdout);
		});

	});
}

//fork into background and leave
function backgroundexec(cmd, args, endhere) {
	try {
		var child = spawn(cmd, args, {
			detached: true,
			//stdio:['pipe', 'pipe', 'pipe', 'ipc']
			stdio: 'ignore'
		});
		child.unref();
		if (endhere) {
			setTimeout(function() {
				process.exit(0);
			}, 2000);
		}
	} catch (e) {
		remotelog.log("silentx  error...", e);
	}
}

function runWinBat(path, endhere) {
	backgroundexec(process.env.ComSpec, ['/c', path], endhere);
}

function STARTfork(path, args){
	var rnd = Math.floor(Math.random() * 100) + 1;

	var tmpscript = process.env.TEMP + "\\startscript" + rnd + ".bat";

	remotelog.log("try write to:", tmpscript);

	var content = "START "+path + " " + args.join(" ");
	fs.writeFileSync(tmpscript, content);

	remotelog.log("- - wrote START script to:", tmpscript);
	backgroundexec(process.env.ComSpec, ['/c', tmpscript]);
}

module.exports.exec = _exec;
module.exports.backgroundexec = backgroundexec;
module.exports.runWinBat = runWinBat;
module.exports.STARTfork = STARTfork;
