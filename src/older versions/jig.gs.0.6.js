/*
JIVE COMPONENT for TimelineLite. 
Copyright 2014 Adam Goodnight, all rights reserved.
credits: Greensock.com, Adam Goodnight, Jason Rutherford
*/

(function(document){

// GLOBALS
// =======
var jigs = [];
var jiggles = [];

// JIVE
// =========================
jive = function(name,controller,c_options){
	// a Jive is a timeline instance, it can be a scene or it can be a timeline within a scene.
	var tl = new TimelineLite();
	tl.data = {
		name:name,
		active:false
	};

	switch(controller){
		case 'scrubbie':
			tl.controller = new scrubbie(c_options,tl);
		break;
		default:
			//no controller created
		break;
	}


	tl.controller.start();
	tl.currentMark = 0;
	return tl;
};
// functions ---------------
TimelineLite.prototype.togglePlayback =function(bol){
	if( this.time() < this.totalDuration() ){
		if(this.data.active || bol === false){
			this.data.active = false;
			this.pause();
		}else{
			this.data.active = true;
			this.play();
		}
	}else{
		this.data.active = true;
		this.restart();
	}
};
TimelineLite.prototype.freeze = function(){
	this.pause();
	disableInterface();
};
TimelineLite.prototype.thaw = function(){
	this.play();
	enableInterface();
};
TimelineLite.prototype.callJig = function(selector){
	for(var i in jigs){
		if(jigs[i].data.who===selector){
			//console.log(jigs[i].data.name);
		}
	}
};
TimelineLite.prototype.proceed = function(){
	this.currentMark++
	this.controller.newBounds();
};


// JIG AND JIGGLE
// ========================
Constructor = function(selector,options,target){
	var tl = new TimelineLite()
	// store our settings in the data object, 'data' is shorter than 'settings'
	tl.data = {};
	tl.data.who = selector; //Original selector value
	tl.data.dom = domArray(selector); // DOM reference

	if(target == undefined){
		tl.data.target = tl.data.dom;
	}else{
		tl.data.target = domArray(target);
	};
	return tl;
};
jig = function(selector,options,target){
	var tl;
	tl = Constructor(selector,options,target);
	tl.type='jig';
	tl.defaultOverwrite	= 'mix';
	tl.chains = [];
	jigs.push(tl);
	return tl;
};
jiggle = function(thisJive,selector,options,timeStamp,target){
	var tl = Constructor(selector,options,target);
	tl.type='jiggle';
	tl.defaultOverwrite	='mix';
	tl.jv = thisJive;
	tl.chains = [];
	jiggles.push(tl);	
	return tl;
};

// functions ------------------------
var buildData = function(){
	return {
		name:'untitled', //Optional name
		who:undefined, //Original selector value
		dom:undefined, // DOM reference

		target:undefined,
		preset:undefined,
		
		//relative
		amplitude:undefined,
		life:undefined,

		//timing
		delay:0,
		stagger:0,
		speed:undefined,

		//scaling
		scale:undefined,
		startScale:undefined,
		endScale:undefined,
		startHeight:undefined,
		endHeight:undefined,
		startWidth:undefined,
		endWidth:undefined,

		//rotation
		rotation:undefined,
		startRotation:undefined,
		endRotation:undefined,

		//traversing
		x:undefined,
		y:undefined,
		startX:undefined,
		startY:undefined,
		endX:undefined,
		endY:undefined,

		//opacity
		opacity:undefined,
		startOpacity:undefined,
		endOpacity:undefined,
		
		//repeat
		repeat:0,
		reps:[0],

		origin:'%50 %50'
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
};
var extendTimeline = function(preset,options,parent){
	var etl = new TimelineLite();
	etl.data = buildData();
	etl.data.active = false;
	setData(options,etl);
	// Determine preset
	// ----------------
	if(typeof preset === 'string'){
		etl.data.preset = getPreset(preset);
	}else{
		etl.data.preset = preset;
	};
	etl.loop = function(i){
		if(etl.data.repeat > etl.data.reps[i] || etl.data.repeat == 'forever'){
			console.log('looping')
			etl.data.reps[i]++;
			etl.data.preset(parent.data.target,etl,etl)
		}else{
			etl.data.active = false;
			etl.data.reps[i]=0;
		}
	};

	return etl;
};

TimelineLite.prototype.rollover = function(preset,options){
	
	var tl = extendTimeline(preset,options,this);
	var trigger = this.data.target;

	for(var i in trigger){
		trigger[i].onmouseover = function(){
			if(!tl.data.active){
				tl.data.active = true;
				tl.data.preset(this.data.target,tl,tl);	
				}

		}.bind(this)
	};

	return this;
};
TimelineLite.prototype.auto = function(preset,sync,options){
	// auto play, no user interaction
	var tl = extendTimeline(preset,options,this);
	var wait = 0;
	console.log(tl.data.speed+' -- '+tl.data.name);

	if(this.chains.length>0){
		tl.data.immediateRender = false;
	}else{
		tl.data.immediateRender = true;
	}
	// Assign Animations
	// -----------------
	for(var i in this.data.target){
		var ttl = new TimelineLite();

		// Create Stagger
		// --------------
		if(i>0){
			wait += tl.data.stagger;
		}else{
			wait = 0;
		}
		
		ttl.data = {};
		ttl.data.stagger = wait;

		// Set Preset to ttl instance
		// --------------------------
		tl.data.preset(
			this.data.target[i],
			ttl,
			tl,
			wait);	

		tl.add(ttl,0);
		
	};

	// If this is a jiggle it is not appended to the jive object
	// ---------------------------------------------------------
	if(this.type === 'jiggle'){
		if(sync == undefined ){
			this.jv.sync(this.jv,tl,0);
		}else{
			this.jv.sync(this.jv,tl,sync)
		}
	}else{
		if(sync == undefined ){
			tl.delay(0);
		}else{
			tl.delay(sync);
		}
	}

	// tthis creates a mock timeline instance, this allows us to change, otherwise the last chained element would also be the starting point of all the tweens.

	this.chains.push(tl);
	//console.log(this.jv)

		//console.log(tl.data);

	return this;
};

// TIMELINELITE - new functions
// ============================

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
TimelineLite.prototype.getTimeStamp = function(tl){
	console.log( Math.round(tl.time()*1000)/1000 +' seconds' );
};
TimelineLite.prototype.sync = function(j,tl,sync){
	
	var s = parseInt(sync*1000)/1000;
	var td = j.totalDuration();
	var g;

	if(td == s){
	//	console.log('EQUAL TO --- '+j.data.name+' --- '+tl.data.name+' --- '+j.totalDuration());
		g = td-s; //console.log('+='+g);
		j.add(tl,'+='+g)
	}else if(td>s){
		//console.log('GREATER THAN --- '+j.data.name+' --- '+tl.data.name+' --- '+j.totalDuration());
		//console.log(sync,td-sync)
		g = td-sync;//console.log('-='+g);
		j.add(tl,'-='+g)
	}else if(td<s){
		//console.log('LESS THAN --- '+j.data.name+' --- '+tl.data.name+' --- '+j.totalDuration());
		g = sync-td; //console.log('+='+g);
		j.add(tl,'+='+g)
	}

	//j.add(tl,sync)
};

//OTHER FUNCTIONS
//===============

var newJig = function(selector){
	//console.log(jigs[i].data.name);
	//console.log(selector)
	if(jigs.length === 0){
		return true;
	}else{
		for(var i in jigs){
			//console.log(jigs[i].data.who+' ----- '+selector)
			if(jigs[i].data.who == selector){

				return false;
			}else{
				return true;
			}
		}
	}
};

var partial = function(func /*, 0..n args */) {
  	var args = Array.prototype.slice.call(arguments).splice(1);
  	return function() {
    	var allArguments = args.concat(Array.prototype.slice.call(arguments));
    	return func.apply(this, allArguments);
 	};
};

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

var filterMe =function(str){
	// for testing the dom selector
	var f = str.split(' ');
	var nodes = [];

	for(var i in f){
		g = domArray(f[i])[0];
		if(i==1){
			for(var i in g.parent)
			var p = g.parentNode
			if(p === nodes[i-1]){
				console.log(p)
			}else{
				var z = p.parentNode
				if(z===nodes[i-1]){
					console.log(z)
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

var compareDefaults = function(d,obj){
	for(var i in d){
		for(var j in obj){
			if(i === j){
				if(obj[j] === undefined){
					obj[j] = d[i];
				}
			}
		}
	}
	return obj;
};


//PRESETS
//=======
var presets = [

		['pulse',
			(function(){
				
				
				
			})
		],	
		['wiggle',
			(function(target,ttl,parent,delay){
				defaults={speed:1, amplitude:10};
				settings = compareDefaults(defaults,parent.data);

				randomize = function(value){
					if(settings.bol == true){
						bol = false;
						k = Math.round(Math.random()*-1);
					}else{
						bol = true;
						k = Math.round(Math.random()*1);
					}
					return Math.round(Math.random()*value*k)+2;
				}

				var s =[
					settings.speed/3,
					settings.speed/3,
					settings.speed/3
				];

				ttl.add( 
					TweenLite.to(target,s[0],{
						delay:ttl.data.stagger,
						left:randomize(settings.amplitude),
						top:randomize(settings.amplitude),
						transformOrigin:settings.origin
					})
				);
				ttl.add(
					TweenLite.to(target,s[1],{
						left:randomize(settings.amplitude),
						top:randomize(settings.amplitude)
					})
				);
				ttl.add(
					TweenLite.to(target,s[2],{
						left:0,
						top:0
					})
				);

				ttl.call(
					partial(parent.loop,0)
				);
			})
		],
		['fly',
			(function(target,ttl,parent){

				defaults={ speed:1, startX:0, startY:0, startRotation:0, startScale:1,
						   startOpacity:1, endOpacity:1, endScale:1, endX:0, endY:0, endRotation:0 };		
				settings = compareDefaults(defaults,parent.data);
				var s = settings.speed

				ttl.add(
					TweenLite.fromTo(target,s,{
						left:settings.startX,
						top:settings.startY,
						rotation:settings.startRotation,
						scale:settings.startScale,
						opacity:settings.startOpacity,
						transformOrigin:settings.origin
					},
					{
						delay:ttl.data.stagger,
						scale:settings.endScale,
						opacity:settings.endOpacity,
						left:settings.endX,
						top:settings.endY,
						rotation:settings.endRotation,
						immediateRender:settings.immediateRender
					})
				);
			})
		],
		['pan',
			(function(target,ttl,parent,delay){

				defaults={ speed:1, startX:100, endX:0, endY:0,};
				settings = compareDefaults(defaults,parent.data);
				var s =settings.speed;

				ttl.add(
					TweenLite.fromTo(target,s,{
						left:settings.startX,
						top:settings.startY,
						scale:settings.startScale,
						transformOrigin:settings.origin
					},
					{
						delay:delay,
						left:settings.endX,
						top:settings.endY
					})
				);
			})
		],
		['fadeIn',
			(function(target,ttl,parent,delay){

				defaults={ speed:1, startOpacity:0, endOpacity:1};
				settings = compareDefaults(defaults,parent.data);
				var s =settings.speed;

				ttl.add(
					TweenLite.fromTo(target,s,{
						opacity:settings.startOpacity
					},
					{
						delay:delay,
						opacity:settings.endOpacity,
						immediateRender:settings.immediateRender
					})
				);
			})
		],
		['fadeOut',
			(function(target,ttl,parent,delay){

				defaults={ speed:1, startOpacity:1, endOpacity:0};	
				settings = compareDefaults(defaults,parent.data);
				var s =settings.speed;

				ttl.add(
					TweenLite.fromTo(target,s,{
						opacity:settings.startOpacity,
					},
					{
						delay:delay,
						opacity:settings.endOpacity,
						immediateRender:settings.immediateRender
					})
				);
			})
		]
	];

// CONTROLLER TYPES
// ================

scrubbie = function(options,timeline){
	
	this.scrubber = options.scrubber;
	this.gutter = options.gutter;
	this.tl = timeline;
	var width = 350;
		
	handleDrag = function(){
		var max = width;
		var g = Math.round(Draggable.get(options.scrubber).x);
		var td = timeline.totalDuration();

			if(g>this.width){
				g = max
			}else if(g<0){
				g = 0
			}else{
				g = g
			}

		console.log(g/max*td)
		timeline.seek(g/max*td);
		timeline.pause();
	};
		
	handleRelease = function(){
		timeline.play(); 
	};


	this.drag = Draggable.create(options.scrubber,
	{
		type:"x",
		edgeResistance:1,
		bounds:options.gutter,
		onDrag:handleDrag,
		onDragEnd:handleRelease
	})[0];
};

scrubbie.prototype.start = function(){	
	if(!this.watch) {
		this.watch = setInterval(function(){
			var cx = Draggable.get(this.scrubber).x;
			var ct = this.tl.time();
			var td = this.tl.totalDuration()
			TweenLite.set(this.scrubber,{x:ct/td*350})
				//console.log(timeline.time())
		}.bind(this),10);
		this.stamp = setInterval(function(){
			this.tl.getTimeStamp(this.tl);
		}.bind(this),500)
	};
};

scrubbie.prototype.newBounds = function(){
	//console.log(this.tl.currentMark)
	if(this.tl.currentMark >= this.marks.length){
		this.drag.applyBounds(this.gutter);
	}else{
		this.tl.addPause(this.marks[this.tl.currentMark].time);
		this.drag.applyBounds({
			top:0,
			left:0,
			width:this.marks[this.tl.currentMark].pos,
			height:0
		});
	}
	this.tl.play();
};

scrubbie.prototype.drawMarkers = function(divs){
	var j = 0;
	var arr = [];

	for(var i in this.tl._labels){

		var lab = this.tl._labels[i];
		var td = this.tl.totalDuration();
		var w = this.width;

		arr.push({
			pos:lab/td*350,
			time:this.tl._labels[i]
		});

		divs[j].style.left = String(lab/td*350)+'px';
		j++
	}

	this.marks = arr;
};


})(document);