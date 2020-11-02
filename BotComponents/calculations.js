function formatNumberValues(number){
  var n = parseInt(number);
  console.log(n);
  return n.toLocaleString();
}

module.exports = {formatNumberValues};