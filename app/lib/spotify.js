var date = require('./date');
console.log(date);

module.exports = {
	makePlaylistName: function(type, start, end) {
		var dates = {
			fromMonth: date.getMonthName(start),
			toMonth: date.getMonthName(end),
			fromYear: start.getFullYear(),
			toYear: end.getFullYear()
		}

		var yearIsSame = (dates.fromYear === dates.toYear);
		var monthIsSame = (dates.fromMonth === dates.toMonth);

		var fromMonth = (yearIsSame ? dates.fromMonth : dates.fromMonth + ' ' + dates.fromYear);
		var toMonth = (yearIsSame ? dates.toMonth : dates.toMonth + ' ' + dates.toYear);

		var dateString = (monthIsSame ? fromMonth : fromMonth + ' to ' + toMonth) + ' ' + (yearIsSame ? dates.fromYear : '');
		var name = 'Throwbacks - ' + dateString + ' ('+type+')';
		return name;
	}
}