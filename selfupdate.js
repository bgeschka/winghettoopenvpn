const config = require('./custom/config.js');
const getpromise = require('./getpromise.js');
const get = require('./get.js');
const fs = require('fs');
const getMD5 = require('./md5.js');
const Spinner = require('./spinner.js');
const remotelog = require('./remotelog.js');

const {
	backgroundexec,
	runWinBat,
	STARTfork
} = require('./exec.js');

//download once a day then re-exec self
//
function quote(str){
	return '"' + str + '"';
}

function updatecheck(cb /*arg:justupdated bool*/ ) {
	//test if we are started with update args, and move the binary
	remotelog.log("do we need an update?", process.argv[1]);
	//pkg actually shifts those by 1
	if(process.argv[2] != "update") {
		remotelog.log("no update x in progress");
		cb(false);
		return;
	}
	remotelog.log("update in progress", process.argv);

	//copy process.execPath to argv[2] the binary
	var oldpath = process.argv[3];
	var newbin = process.argv[4];
	remotelog.log("overwrite old binary:",oldpath, "with new one:", newbin);

	fs.copyFileSync(newbin, oldpath);
	cb(true);
}

function copyexec(newpath){
	remotelog.log("try xto launch new bin from:", newpath);
	fs.copyFileSync(newpath, newpath+".new");
	STARTfork(newpath, ["update", quote(process.execPath), quote(newpath+".new")]);
	process.exit(0);
}

function md5check(md5ok, md5notok) {
	remotelog.log("md5check");
	getMD5(process.execPath, function(currentmd5) {
		get(config.selfupdatemd5, function(err, res) {
			if(err) {
				remotelog.log("md5 download failed");
				md5ok();
				return;
			}
			var newmd5 = res.body.toString();
			remotelog.log("md5 test:", currentmd5, "=", newmd5);
			if(newmd5.trim() == currentmd5.trim()) {
				md5ok()
			} else {
				md5notok()
			}
		});
	});
	
}

function selfupdate() {
	var tmpdst = process.env.TEMP + "\\vpn_selfupdate.exe";
	return new Promise((resolve, reject) => {
		updatecheck(function(justupdated) {
			remotelog.log("post-update-check:", justupdated);
			if(justupdated) {
				resolve();
				return;
			}

			md5check(function() {
				remotelog.local("bereits up-to-date");
				resolve();
			}, function() {
				remotelog.local("lade Update");
				var s = new Spinner();
				s.start();
				get(config.selfupdate, function(err, res) {
					s.stop();
					if (err) {
						remotelog.log("failed to download update");
						resolve();
						return;
					}
					var data = res.body;
					fs.writeFileSync(tmpdst, data);
					copyexec(tmpdst);
				});
			});
		});
	});
};


module.exports = selfupdate;
//selfupdate();
