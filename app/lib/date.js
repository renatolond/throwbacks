module.exports = {
	getUnixTime: function(date) {
		return  (new Date(date).getTime() / 1000);
	},
	getMonthName: function(date) {
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		return months[date.getMonth()];
	}
	
}