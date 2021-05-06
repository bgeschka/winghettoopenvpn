var crypto = require('crypto');
var config = require('./custom/config.js');
var fs = require('fs');

function checksum(str, algorithm, encoding) {
	return crypto
		.createHash(algorithm || 'md5')
		.update(str, 'utf8')
		.digest(encoding || 'hex');
}

function getMD5(filepath, done) {
	return new Promise( (resolve,reject) => {
		fs.readFile(filepath, function(err, data) {
			if(err) {
				reject(err);
				throw err;
			}
			if(done) {
				done(checksum(data)); // e53815e8c095e270c6560be1bb76a65d
			}
			resolve(checksum(data));
		});
	});
}

module.exports = getMD5;
