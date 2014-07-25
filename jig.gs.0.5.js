/*
JIVE COMPONENT for TimelineLite. 
Copyright 2014 Adam Goodnight, all rights reserved.
credits: Greensock.com, Adam Goodnight, Jason Rutherford
*/

(function(document){

// GLOBALS
// =======
var jv;
var jigs = [];
var jiggles = [];

// JIVE
// =========================
jive = function(name){
	// a Jive is a timeline instance, it can be a scene or it can be a timeline within a scene.
	var tl = new TimelineLite();
	tl.data = {
		name:name,
		active:false
	};

	jv = tl;
	return tl;
};
// functions ---------------
TimelineLite.prototype.togglePlayback =function(){
	if(jv.data.active){
		jv.data.active = false;
		//console.log(jv.data.active)
	}else{
		jv.data.active = true;
		//console.log(jv.data.active)
	}
}
TimelineLite.prototype.freeze = function(){
	this.pause();
	disableInterface();
}
TimelineLite.prototype.thaw = function(){
	this.play();
	enableInterface();
}
TimelineLite.prototype.callJig = function(selector){
	for(var i in jigs){
		if(jigs[i].data.who===selector){
			//console.log(jigs[i].data.name);
		}
	}
}

// JIG AND JIGGLE
// ========================
jig = function(selector,options){
	// a jig is a jive independent timeline
	var tl = new TimelineLite();
	tl.type='jig';
	// store our settings in the data object, 'data' is shorter than 'settings'
	tl.data = {
		name:'untitled', //Optional name
		who:selector, //Original selector value
		dom:domArray(selector), // DOM reference

		target:undefined,
		preset:'pulse',
		
		//timing
		delay:0,
		speed:1,

		//scaling
		scale:1,
		startScale:1,
		endScale:1,
		startHeight:1,
		endHeight:1,
		startWidth:1,
		endWidth:1,

		//rotation
		rotation:0,
		startRotation:0,
		endRotation:0,

		//traversing
		x:0,
		y:0,
		startX:0,
		startY:0,
		endX:0,
		endY:0,

		//opacity
		opacity:1,
		startOpacity:1,
		endOpacity:1,
		
		//repeat
		repeat:0,
		reps:[0],

		origin:'%50 %50'
	};

	setData(options,tl);
	jigs.push(tl);	
	return tl;
}
jiggle = function(selector,options,timeStamp){
	// a jiggle is a jive dependent timeline
	var tl = new TimelineLite();
	tl.type='jiggle';
	
	tl.data = {
		name:'untitled', //Optional name
		who:selector, //Original selector value
		dom:domArray(selector), // DOM reference

		target:undefined,
		preset:'pulse',
		
		//timing
		delay:0,
		speed:1,

		//scaling
		scale:1,
		startScale:1,
		endScale:1,
		startHeight:1,
		endHeight:1,
		startWidth:1,
		endWidth:1,

		//rotation
		rotation:0,
		startRotation:0,
		endRotation:0,

		//traversing
		x:0,
		y:0,
		startX:0,
		startY:0,
		endX:0,
		endY:0,

		//opacity
		opacity:1,
		startOpacity:1,
		endOpacity:1,
		
		//repeat
		repeat:0,
		reps:[0],

		origin:'%50 %50'
	};

	setData(options,tl);
	jiggles.push(tl);	
	return tl;
};
// functions ------------------------
TimelineLite.prototype.rollover = function(preset,options){
	// preset = a function declared as a string or object
		/* if it is a string it will search the presets object, 
		otherwise it will search for a custom function declared elsewhere*/
	// target = an array or string that identifies waht is going to be animated according to the preset
	// this creates a rollover event which executes a timeline animation on the target/s or the element assigned this event
	var trigger = domArray(this.data.who);
	var tl = new TimelineLite();
	var _this = this;
	
	setData(options,this);
	
	// Is this affecting the trigger or a target?
	if(this.data.target === undefined){
		this.data.target = trigger
	}else{
		this.data.target = domArray(this.data.target);
	}
	// is the preset in the presets object or declared elsewhere?
	if(typeof preset === 'string'){
		this.data.preset = getPreset(preset);
	}else{
		this.data.preset = preset;
	}

	// event
	for(var i in trigger){
		trigger[i].onmouseover = function(){
			_this.data.preset(_this.data.target,tl,_this.data);	
		};
		trigger[i].onmouseout = function(){
			_this.reset('linear',_this.data.target);
		};
	};

	// chaining
	return this;
};

TimelineLite.prototype.auto = function(preset,options){
	// auto play, no user interaction
	var trigger = domArray(this.data.who);
	var tl = new TimelineLite();
	setData(options,this);


	if(this.data.target === undefined){
		this.data.target = trigger
	}else{
		this.data.target = domArray(target);
	};

	if(typeof preset === 'string'){
		this.data.preset = getPreset(preset);
	}else{
		this.data.preset = preset;
	};
	var wait = 0;
	for(var i in this.data.target){
		wait += this.data.delay;
		console.log(wait)
		var ttl = new TimelineLite();
		this.data.preset(this.data.target[i],ttl,this.data,wait);	
		tl.unshift(ttl);
	};

	if(this.type === 'jiggle'){
		jv.unshift(tl)
	}

	return this;
};

TimelineLite.prototype.loop=function(){
	
	//console.log(this.data.name)
	
	if(this.data.reps<this.data.repeat){
		this.data.preset(this.data.target,tl,this.data);
	}
};

// TIMELINELITE - new functions
// ============================
TimelineLite.prototype.unshift = function(tl,delay){
		// tl = timeline instance
		// time = a delay either in milliseconds or a timestamp format to offset the start of the timeline instance in relation to the jives 0 point.
		//syncs up a 'jig' (TimelinLite instance) with a delay from the start of 'thisJive (jv)'
		var td = (this.totalDuration())+delay;
		this.add(tl,'-='+td);
		//console.log('pushed '+tl)
};
TimelineLite.prototype.sync = function(tl,time){
	// tl = timeline instance
	// time = a timestamp indicating when to start the timeline in the jive 
	// syncs up a 'jig' (TimelinLite instance) with a timestamp relative to 'thisJive (jv)'
	var when = timeToMs(time);
	this.add(tl,'-='+when);
	//console.log('pushed '+o)
};
TimelineLite.prototype.trigger = function(funcs){
	// funcs = array or object
	// executes functions passed to i
	var trigger = domArray(this.data.who)[0];
	trigger.onmousedown=function(){
		funcs();
	};
};
TimelineLite.prototype.reset= function(target){
	//target = array/string
	//transition the target's CSS and JS to what it was before the timeline animated.
};
TimelineLite.prototype.getTimeStamp = function(){
	console.log(tsToMs('2:10'));
}

//OTHER FUNCTIONS
//===============

partial = function(func /*, 0..n args */) {
  	var args = Array.prototype.slice.call(arguments).splice(1);
  	return function() {
    	var allArguments = args.concat(Array.prototype.slice.call(arguments));
    	return func.apply(this, allArguments);
 	};
};


var setData = function(options,me){
	for(var j in options){
		for(var i in me.data){
			if(j==i){
				me.data[i] = options[j]
			}
		}
	};
}

var getPreset = function(str){
	var err=0;
	for(var i in presets){
		//console.log(i)
		if(presets[i][0] === str){
			return presets[i][1];
			break;
		}else{
			err++	
		}
	}
	if(err===presets.length){
		//console.log('Reference Error: No preset found')		
	}
};

var removePrefix = function(o){
		var name;
		switch(o[0]){
				// if an id
				case '#':
					name = o.substr(1);
				break;
				//if a class
				case '.':
					name = o.substr(0);
				break;
				//if a tag or anything else
				default:
					name = o
				break;
			}
		return name;
};

filterMe =function(str){
	// for testing the dom selector
	var f = str.split(' ');
	var nodes = [];

	for(var i in f){
		g = domArray(f[i])[0];
		if(i==1){
			for(var i in g.parent)
			var p = g.parentNode
			if(p === nodes[i-1]){
				//console.log(p)
			}else{
				var z = p.parentNode
				if(z===nodes[i-1]){
					//console.log(z)
				}
			}
		}
		nodes.push(g)
	}

};

var domArray = function(o){
		var arr;
		var element;

		if(o instanceof Array || o instanceof Object){
			arr = o; // needs to return actual objects
		}else{
			arr = [];

			switch(o[0]){
				// if an id
				case '#':
					arr = [document.getElementById(o.substr(1))];
				break;
				//if a class -- this is acting funny
				case '.':
					element = Array.prototype.slice.call(document.getElementsByClassName(o.substr(1)));
					for(var i in element){
						arr.push(element[i]);
					}
				break;
				//if a tag or anything else
				default:
					try{
						element = Array.prototype.slice.call(document.getElementsByTagName(o));
						for(var i in element){
							arr.push(element[i]);
						}
					}catch(err){console.log('Selector is not valid, see documentation')};
				break;
			}
		}
		return arr;
};

var tsToMs = function(timestamp){

	//Minutes Seconds Miliseconds  Max Miliseconds 
	/*
	 * function timestampToMilliSeconds
	 * Input: timestamp : string in the format MM:SS:MS
	 * MM must be 0+, SS Must be between 0 and 59, MS is optional, but it must be between 0 and 999.  Decimal points are not allowed
	*/

	//local variables
	var timeStampParts; //The array that will contain the parts of the TimeStamp
	var hasMilliseconds = false; //Did the time Stamp contain Milliseconds
	var conversionFailed = false;  //This will be set if the conversion fails for some reason
	var minutes; //this is the number of minutes in the timestamp
	var seconds; //this is the number of seconds in the timestamp
	var milliseconds; //this is the number of milliseconds in the timestamp
	var msReturnValue = 0; //This is the value to return
	
	//Error Checking
	//Input must be a string
	if (typeof timestamp != 'string')
	{
		return false;
	}
	//There must be one or two colons.  This check is made by splitting the time stamp around the colons.  We will need these parts later anyway.
	timeStampParts = timestamp.split(":");
	if (timeStampParts.length < 2 || timeStampParts > 3)
	{
		return false;
	}
	
	//someone though they could sneak a decimal point into the timestamp.
	if (timestamp.split(".").length > 1)
	{
		return false;
	}
	
	//End Error Checking
	
	//Check to see if the timestamp has a Milliseconds section
	if (timeStampParts.length == 3)
	{
		hasMilliseconds = true;
	}
	
	//Minutes is the first value, seconds is the second, and milliseconds, if included is the third one
	//Try and covnert the parts into integers
	
	//Convert Minutes
	if (isNaN(timeStampParts[0]))
	{
		conversionFailed = true;
		minutes = 0;
	}
	else
	{
		minutes = parseInt(timeStampParts[0]);
	}
	
	//Convert Seconds
	if (isNaN(timeStampParts[1]))
	{
		conversionFailed = true;
		seconds = 0;
	}
	else
	{
		seconds = parseInt(timeStampParts[1]);
	}
	
	//convert Milliseconds
	if (hasMilliseconds)
	{
		if (isNaN(timeStampParts[2]))
		{
			conversionFailed = true;
			milliseconds = 0;
		}
		else
		{
			milliseconds = parseInt(timeStampParts[2]);
		}
	}
	else
	{
		milliseconds = 0;
	}
	
	
	
	//conversion has been completed.  Try and Build the Timestamp
	if (!conversionFailed )
	{
		//check the bounds for the numbers
		if (minutes >=0 && seconds >=0 && seconds < 60 && milliseconds >=0 && milliseconds < 1000)
		{
			msReturnValue = minutes * 60000 + seconds * 1000 + milliseconds;
		}
		else 
		{
			msReturnValue = false;
		}
	}
	else
	{
		msReturnValue = false;
	}
	
	
	//Handle the final return value
	return msReturnValue;
};


//PRESETS
//=======
var presets = [

		['pulse',
			(function(){
				//console.log('pulsing');
			})
		],
		
		['wiggle',
			(function(target,tl,settings,delay){
				var s =[
				settings.speed/2,
				settings.speed/2
				];

				tl.to(target,s[0],{
					delay:delay,
					scale:settings.scale,
					transformOrigin:settings.origin
				});
				tl.to(target,s[1],{
					scale:1
				});
				//tl.call(tl.loop);
			})
		],
		['fly',
			(function(target,tl,settings,delay){
				var s =[
				settings.speed/2,
				settings.speed/2
				];

				tl.fromTo(target,s[0],{
					left:settings.startX,
					top:settings.startY,
					rotation:settings.startRotation,
					scale:settings.startScale,
					opacity:settings.startOpacity,
					transformOrigin:settings.origin
				},
				{
					delay:delay,
					scale:settings.endScale*.9,
					opacity:settings.endOpacity*.5,
					left:settings.endX,
					top:settings.endY,
					rotation:settings.endRotation*.5
				});

				tl.to(target,s[1],{
					scale:settings.endScale,
					opacity:settings.endOpacity,
					left:settings.endX,
					top:settings.endY,
					rotation:settings.endRotation
				});
			})
		],
		['pan',
			(function(target,tl,settings,delay){
				var s =settings.speed;

				tl.fromTo(target,s,{
					left:settings.startX,
					top:settings.startY,
					scale:settings.startScale,
					transformOrigin:settings.origin
				},
				{
					delay:delay,
					left:settings.endX,
					top:settings.endY
				});

			})
		]
];

})(document);