
function getWeekNumber(d) {
  d = d ? new Date(+d) : new Date();
  d.setHours(0,0,0);
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setDate(d.getDate() + 4 - 1 - (d.getDay()||7)); // -1 to stay in previous week!
  var firstDayOfYear = new Date(d.getFullYear(),0,1);
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - firstDayOfYear) / 86400000) + 1)/7);
  return [d.getFullYear(), weekNo];
}

function weeksInYear(year) {
  var month = 11, day = 31, week;
  // Find week that 31 Dec is in. If is first week, reduce date until get previous week.
  do {
    var d = new Date(year, month, day--);
    week = getWeekNumber(d)[1];
  } while (week == 1);
  return week;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


exports.getWeekNumber = getWeekNumber;
exports.weeksInYear = weeksInYear;
exports.isNumber = isNumber;