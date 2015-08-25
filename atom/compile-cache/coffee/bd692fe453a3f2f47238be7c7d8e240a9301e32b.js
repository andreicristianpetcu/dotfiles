(function() {
  var isFunction, isString, isType;

  isFunction = function(value) {
    return isType(value, 'function');
  };

  isString = function(value) {
    return isType(value, 'string');
  };

  isType = function(value, typeName) {
    var t;
    t = typeof value;
    if (t == null) {
      return false;
    }
    return t === typeName;
  };

  module.exports = {
    isFunction: isFunction,
    isString: isString
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLFNBQUMsS0FBRCxHQUFBO1dBQ1gsTUFBQSxDQUFPLEtBQVAsRUFBYyxVQUFkLEVBRFc7RUFBQSxDQUFiLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsU0FBQyxLQUFELEdBQUE7V0FDVCxNQUFBLENBQU8sS0FBUCxFQUFjLFFBQWQsRUFEUztFQUFBLENBSFgsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxTQUFDLEtBQUQsRUFBUSxRQUFSLEdBQUE7QUFDUCxRQUFBLENBQUE7QUFBQSxJQUFBLENBQUEsR0FBSSxNQUFBLENBQUEsS0FBSixDQUFBO0FBQ0EsSUFBQSxJQUFvQixTQUFwQjtBQUFBLGFBQU8sS0FBUCxDQUFBO0tBREE7V0FFQSxDQUFBLEtBQUssU0FIRTtFQUFBLENBTlQsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFBQyxZQUFBLFVBQUQ7QUFBQSxJQUFhLFVBQUEsUUFBYjtHQVhqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/andrei/dotfiles/atom/packages/autocomplete-plus/lib/type-helpers.coffee