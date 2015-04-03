module.exports = {
	getUnixTime: function(date) {
		return  (new Date(date).getTime() / 1000);
	}
	
}