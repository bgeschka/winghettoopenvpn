function Spinner() {
	this.timer = null;
	this.start = function() {
		this.timer = setInterval(function() {
      			process.stdout.write(".")
		}, 500);
	}
	this.stop = function() {
		if (!this.timer) {
			return;
		}
		clearInterval(this.timer);
      		process.stdout.write("\n")
	}
	return this;
	
}


module.exports = Spinner;
