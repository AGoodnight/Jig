//--------------------------------------
function logEach(arr){
	for(var i=0; i<arr.length ; i++){
		console.log(arr[i]);
	}
};

//--------------------------------------
function forEach(arr,act){
	for(var i = 0 ; i<arr.length; i++){
		act(arr[i]);
	}
};

//--------------------------------------
function greaterThan(n){
	return function(m) {return m>n};
};

var gT10 = greaterThan(10);
gT10(11); //true

//--------------------------------------
function noisy(f){
	return function(arg){
		var val = f(arg);
		return val;
	}
};

//--------------------------------------
function unless(test, then){
	if(!test) then();
};

function repeat(times, body){
	for(var i = 0 ; i < times; i++) body(i);
};

/*repeat(3, function(n){
	unless( noisy(Boolean)(0), function(){
		console.log('boolean is true')
	});
});*/

//--------------------------------------
function fun(one,two,three){
	console.log(three);
};

function trans(f){
	return function(){
		return f.apply(null,arguments);
	}
};

//trans(fun)('silly','fred','sally')

//--------------------------------------
var string = JSON.stringify({name:'Y', born:1980});
//console.log('I want Pokemon '+JSON.parse(string).name);

//--------------------------------------
function filter(array, test){
	var passed=[];
	for(var i in array){
		if(test(array[i]))
			passed.push(array[i]);
	}
	return passed;
}

//--------------------------------------
