const QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  const query_string = {};
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i=0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      query_string[pair[0]] = [query_string[pair[0]], decodeURIComponent(pair[1])];
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();

export default QueryString;