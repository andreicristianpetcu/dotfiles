function rWsetTimeout(min, max){
var time = rnd(min, max);
document.title = "[1k"+koeff+"]"+"Job[" + count + "] - " + time + "ms";
setTimeout(function(){refreshPage();}, time);
}
