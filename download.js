var getMD5 = require('./md5.js');
var get = require('./get.js');
const fs = require('fs');

function download(url, dst, md5) {
	return new Promise((resolve, reject) => {
		get(url, function(err, res) {
			var data = res.body;
			fs.writeFile(dst, data, (err) => {
				if (err) throw err;

				getMD5(dst, function(md5sum) {
					if(md5sum == md5) 
						setTimeout(() => {
							resolve(fs.realpathSync(dst));
						}, 1000);
					else
						throw(new Error("md5sum incorrect"));
				});
			});
		});
	});

}


module.exports = download;
