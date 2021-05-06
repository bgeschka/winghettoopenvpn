/*
 *
 * module to perform a ping like on a website
 *
 */

const remotelog = require('./remotelog.js');
const http = require('http');
const DEBUG = false;

function webping(url, timeoutms) {
	remotelog.log("pinging:", url);
	return new Promise((resolve, reject) => {
		var req = http.get(url, function(res) {
			if (res.statusCode != 200) {
				reject(res);
				return;
			}
			resolve("ok");
		});
		req.setTimeout(timeoutms||10000, function() {
			    req.abort();
		});
		req.on('error', reject);
	});
}

function hasinternet(opturl) {
	return webping("http://files.bgeschka.de/ip.php");
}

function pollweb(url, _callback) {
	webping(url).then(_callback).catch(function() {
		setTimeout(function() {
			DEBUG && remotelog.log("polling", url);
			pollweb(url, _callback);
		}, 500);
	});
}

module.exports.webping = webping;
module.exports.hasinternet = hasinternet;
module.exports.pollweb = pollweb;

//pollweb("http://files.bgeschka.de/blah", function() {
//	remotelog.log("url is avail!");
//});
