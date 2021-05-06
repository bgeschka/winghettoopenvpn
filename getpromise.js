const get = require('./get.js');

module.exports = function(url) {
	return new Promise( (resolve,reject) => {
		get(url, function(err, res) {
			if(err) {
				reject(err);
				return false;
			}

			resolve(res.body);
		});
	});
};

