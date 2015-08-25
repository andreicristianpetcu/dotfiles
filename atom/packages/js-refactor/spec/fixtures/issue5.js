var cache, fibonacci, index, _i;

cache = [0, 1];

fibonacci = function(n) {
  if (cache[n] != null) return cache[n];
  return cache[n] = fibonacci(n - 1) + fibonacci(n - 2);
};

for (index = _i = 0; _i <= 10; index = ++_i) {
  console.log(index, fibonacci(index));
}
