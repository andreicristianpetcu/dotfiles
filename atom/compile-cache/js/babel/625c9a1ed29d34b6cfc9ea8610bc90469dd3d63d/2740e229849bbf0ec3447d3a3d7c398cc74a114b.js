var b = require('./b'),
    result;

var c = 100;
var e = {
  foo: 'bar',
  numval1: 10,
  boolval1: true,
  strval1: 'str',
  arrVal1: [1, 2, 3, 4],
  objval1: {
    numval2: 20,
    boolval2: true,
    strval2: 'str2',
    arrVal2: [2, 3, 4, 5],
    objval2: {
      numval3: 30,
      boolval3: true,
      strval3: 'str3'
    }
  }
};

var strVal = "a string value";
var arrVal = [1, 2, 3, 4];

function localFunc(arg1, arg2) {
  var zz = 10;
  var xx = 20;
  return zz + xx;
}

var f_res = localFunc("strParam", 9991);

console.log('this is a log');
console.error('this is an error');

var d = 10;

b(100, function (err, res) {
  result = res;
  console.log('result is: ', result);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHJlaS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2RlbW8vYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2xCLE1BQU0sQ0FBQTs7QUFFVixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDWixJQUFJLENBQUMsR0FBRztBQUNOLEtBQUcsRUFBRSxLQUFLO0FBQ1YsU0FBTyxFQUFFLEVBQUU7QUFDWCxVQUFRLEVBQUUsSUFBSTtBQUNkLFNBQU8sRUFBRSxLQUFLO0FBQ2QsU0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQ2xCLFNBQU8sRUFBRTtBQUNQLFdBQU8sRUFBRSxFQUFFO0FBQ1gsWUFBUSxFQUFFLElBQUk7QUFDZCxXQUFPLEVBQUUsTUFBTTtBQUNmLFdBQU8sRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUNsQixXQUFPLEVBQUU7QUFDUCxhQUFPLEVBQUUsRUFBRTtBQUNYLGNBQVEsRUFBRSxJQUFJO0FBQ2QsYUFBTyxFQUFFLE1BQU07S0FDaEI7R0FDRjtDQUNGLENBQUE7O0FBRUQsSUFBSSxNQUFNLEdBQUcsZ0JBQWdCLENBQUM7QUFDOUIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdkIsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUM3QixNQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDWixNQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDWixTQUFPLEVBQUUsR0FBRyxFQUFFLENBQUM7Q0FDaEI7O0FBRUQsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUE7O0FBRWpDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFWCxDQUFDLENBQUMsR0FBRyxFQUFFLFVBQVMsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUN4QixRQUFNLEdBQUcsR0FBRyxDQUFBO0FBQ1osU0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUE7Q0FDbkMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2FuZHJlaS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2RlbW8vYS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiID0gcmVxdWlyZSgnLi9iJylcbiAgLCByZXN1bHRcblxudmFyIGMgPSAxMDA7XG52YXIgZSA9IHtcbiAgZm9vOiAnYmFyJyxcbiAgbnVtdmFsMTogMTAsXG4gIGJvb2x2YWwxOiB0cnVlLFxuICBzdHJ2YWwxOiAnc3RyJyxcbiAgYXJyVmFsMTogWzEsMiwzLDRdLFxuICBvYmp2YWwxOiB7XG4gICAgbnVtdmFsMjogMjAsXG4gICAgYm9vbHZhbDI6IHRydWUsXG4gICAgc3RydmFsMjogJ3N0cjInLFxuICAgIGFyclZhbDI6IFsyLDMsNCw1XSxcbiAgICBvYmp2YWwyOiB7XG4gICAgICBudW12YWwzOiAzMCxcbiAgICAgIGJvb2x2YWwzOiB0cnVlLFxuICAgICAgc3RydmFsMzogJ3N0cjMnLFxuICAgIH1cbiAgfVxufVxuXG52YXIgc3RyVmFsID0gXCJhIHN0cmluZyB2YWx1ZVwiO1xudmFyIGFyclZhbCA9IFsxLDIsMyw0XTtcblxuZnVuY3Rpb24gbG9jYWxGdW5jKGFyZzEsIGFyZzIpIHtcbiAgdmFyIHp6ID0gMTA7XG4gIHZhciB4eCA9IDIwO1xuICByZXR1cm4genogKyB4eDtcbn1cblxudmFyIGZfcmVzID0gbG9jYWxGdW5jKFwic3RyUGFyYW1cIiwgOTk5MSk7XG5cbmNvbnNvbGUubG9nKCd0aGlzIGlzIGEgbG9nJylcbmNvbnNvbGUuZXJyb3IoJ3RoaXMgaXMgYW4gZXJyb3InKVxuXG52YXIgZCA9IDEwO1xuXG5iKDEwMCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgcmVzdWx0ID0gcmVzXG4gIGNvbnNvbGUubG9nKCdyZXN1bHQgaXM6ICcsIHJlc3VsdClcbn0pO1xuIl19