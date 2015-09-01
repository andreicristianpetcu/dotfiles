var cache, fibonacci, index, _i;

cache = [0, 1];

fibonacci = function (n) {
  if (cache[n] != null) return cache[n];
  return cache[n] = fibonacci(n - 1) + fibonacci(n - 2);
};

for (index = _i = 0; _i <= 10; index = ++_i) {
  console.log(index, fibonacci(index));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHJlaS8uYXRvbS9wYWNrYWdlcy9qcy1yZWZhY3Rvci9zcGVjL2ZpeHR1cmVzL2lzc3VlNS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQzs7QUFFaEMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVmLFNBQVMsR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN0QixNQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsU0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ3ZELENBQUM7O0FBRUYsS0FBSyxLQUFLLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRTtBQUMzQyxTQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztDQUN0QyIsImZpbGUiOiIvaG9tZS9hbmRyZWkvLmF0b20vcGFja2FnZXMvanMtcmVmYWN0b3Ivc3BlYy9maXh0dXJlcy9pc3N1ZTUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY2FjaGUsIGZpYm9uYWNjaSwgaW5kZXgsIF9pO1xyXG5cclxuY2FjaGUgPSBbMCwgMV07XHJcblxyXG5maWJvbmFjY2kgPSBmdW5jdGlvbihuKSB7XHJcbiAgaWYgKGNhY2hlW25dICE9IG51bGwpIHJldHVybiBjYWNoZVtuXTtcclxuICByZXR1cm4gY2FjaGVbbl0gPSBmaWJvbmFjY2kobiAtIDEpICsgZmlib25hY2NpKG4gLSAyKTtcclxufTtcclxuXHJcbmZvciAoaW5kZXggPSBfaSA9IDA7IF9pIDw9IDEwOyBpbmRleCA9ICsrX2kpIHtcclxuICBjb25zb2xlLmxvZyhpbmRleCwgZmlib25hY2NpKGluZGV4KSk7XHJcbn1cclxuIl19