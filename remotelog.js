const config = require('./custom/config.js');
const axios = require('axios');
var os = require("os");
const util = require('util');

var hostname = os.hostname();
var platform = os.platform();
var release = os.release();
var userinfo = os.userInfo();
var username = userinfo.username;

function doPost(dst, msg, done) {
	var ts = new Date().toISOString().
	replace(/T/, ' '). // replace T with a space
	replace(/\..+/, ''); // delete the dot and everything after

	axios
		.post(dst, {
			hostname: hostname,
			platform: platform,
			release: release,
			username: username,
			msg: msg,
			date: ts
		})
		.then(res => {
			//console.log(dst, `statusCode: ${res.statusCode}`);
			//console.log(res);
			if (done) done(res);
		})
		.catch(error => {
			console.error(error);
		});
}

function argsToStr(v) {
	var args = Array.prototype.slice.call(v);
	for (var k in args) {
		if (typeof args[k] === "object") {
			args[k] = util.inspect(args[k], false, null, false /*colored*/ );
		}
	}
	var str = args.join(" ");
	return str;
}

function writelog() {
	// console.log(argsToStr(arguments));
	doPost(config.remotelog, argsToStr(arguments));
}

function installCrashHandler() {
	process.on('uncaughtException', (error) => {
		writelog('uncaughtException:', error);
		process.exit(1); // exit application 
	});

	process.on('unhandledRejection', (error, promise) => {
		writelog(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
		writelog(' The error was: ', error);
	});
}

module.exports.installCrashHandler = installCrashHandler;
module.exports.log = writelog;
module.exports.local = console.log;
