(function() {
  var value,
    __modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  value = __modulo(value, 4000);

  value !== true;

}).call(this);
