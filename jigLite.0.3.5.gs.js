;(function(document){

/*
JIG COMPONENT for TimelineLite. 
Copyright 2014 Adam Goodnight, all rights reserved.

contributors:
Jason Rutherford

TimelineLite was created by Greensock
*/

/* 
"jigLite" is an add-on for GSAP TimelineLite.
Jigs are TimelineLite objects that manage Zigs assigned to a DOM element. 
Zigs are instances of preset animations in the forms of TimelineLite objects.
Jig objects act as virtual controllers for the Zig instances.
Jigs allow developers to easily access a Zigs animation properties.
Jigs allow developers to run collections of Zigs in sequence.
Jigs can be assigned to any instance of TimelineLite and then run as a sequence and so on.

Jig is intended to mirror Adobe's Flash-like animation abilities.
Scenes are TimelineLite instances,
Movieclips are Jigs,
Graphics are Zigs,
and so on
*/

	//======
	// JIG
	//======
	jig = function(nodeString,settings){

		var q = new TimelineLite({paused:true});
		q._active = false;
		
		// Data Intialization
		// -------------------------
		q.data = {

			// attributes
			_name:'untitled',
			_type:'default',

			// playback
			_syncAt:0,
			_cd:0,
			_toggle:undefined,

			// internal tracking
			_latestZig:0
		};


		q.settingsOverwrite = [];
		q.data = replaceSettings(q,settings,q.data);

		// -------------------------

		// Jig attributes
		q.defaultOverwrite = 'none';
		q.type = 'JIG';

		// Nodes
		q.nodeString = nodeString;
		q.node = nodeSelector(nodeString);

		// Instances
		q.instances = [];
		q.zigs = [];

		//q.pause();
		return q;	
	};

	TimelineLite.prototype.computedDuration = function(){
		return this.data._cd;
	}

	//==========================================================
	// PUBLIC CONSTRUCTORS
	//==========================================================

	// ---------------------------------------------------------
	// References to presets which call a buildZig constructor
	// ---------------------------------------------------------
	TimelineLite.prototype.wiggle = function(preset,settings,syncAt){
		return this.buildZig('wiggle',preset,settings,syncAt);		
	};
	TimelineLite.prototype.hop = function(preset,settings,syncAt){
		return this.buildZig('hop',preset,settings,syncAt);
	};
	TimelineLite.prototype.plop = function(preset,settings,syncAt){
		return this.buildZig('plop',preset,settings,syncAt);
	};
	TimelineLite.prototype.spin = function(preset,settings,syncAt){
		return this.buildZig('spin',preset,settings,syncAt);
	};

	// ---------------------------------------------------------
	// Allows user to pass a custom tweenlite constructor
	// ---------------------------------------------------------
	TimelineLite.prototype.tween = function(func){
		return this.buildZig('custom',func);
	};


	// ---------------------------------------------------------
	// Some additional functionality
	// ---------------------------------------------------------
	TimelineLite.prototype.click = function(toggle,trigger){
		return this.mouse(trigger,toggle,'click');
	};
	TimelineLite.prototype.rollover = function(toggle,trigger){
		return this.mouse(trigger,toggle,'rollover');
	};
	TimelineLite.prototype.onComplete = function(func,delay){

		/*setTimeout(function(){
			func();
		},this.totalDuration()*1000)*/

		this.call(
			func
		);

		return this;
	};


	//=====================================================================================
	// PUBLIC FUNCTIONS/CONSTRUCTORS (ADVANCED USERS)
	//=====================================================================================
	TimelineLite.prototype.buildZig = function(type,pre,set,sa){	

		var settings, 
			preset, 
			syncAt,
			q;

		var custom = false;
		// ------------------------------------------------------
		// Handle variation in passed arguments
		// ------------------------------------------------------
		if(typeof pre === 'string' && typeof set === 'object' && typeof sa === 'number'){
			preset = pre;
			settings = set;
			syncAt = sa;
		}else if(typeof pre === 'string' && typeof set === 'object'){
			preset = pre;
			settings = set;
			syncAt = 0;
		}else if(typeof pre === 'object' && typeof set === 'number' ){
			preset = 'lively';
			settings = pre;
			syncAt = set;
		}else if(typeof pre === 'string' && typeof set === 'number'){
			preset = pre;
			settings = undefined;
			syncAt = set;
		}else if(typeof pre === 'object'){
			preset = 'lively';
			settings = pre;
			syncAt = 0;
		}else if(typeof pre === 'number'){
			preset = 'lively';
			settings = undefined;
			syncAt = pre;
		}else if(typeof pre === 'string'){
			preset = pre;
			settings = undefined;
			syncAt = 0;
		}else if(pre === undefined){
			preset = 'lively';
			settings = undefined;
			syncAt = 0;
		}else if(typeof pre === 'function'){
			custom = true;
			settings = undefined;
			syncAt = 0;
		}

		// ------------------------------------------------------
		// Create a Zig and append to Jig (this)
		// ------------------------------------------------------
		if(!custom){
			q = new ZigAnimation(this,type,preset,settings);
		}else{
			q = new ZigAnimation_custom(this,pre);
		}

		// ------------------------------------------------------
		// Handle Sync/Timing behavior
		// ------------------------------------------------------
		if(this.data._type == 'default'){
			this.add(q,syncAt);

		}else if(this.data._type == 'piggyback'){

			var mtd

			if(this.zigs[this.zigs.length-1] !== undefined){
				
				if(this.zigs[this.zigs.length-1].data._repeat>0){
					mtd = this.zigs[this.zigs.length-1].totalDuration()*( (this.zigs[this.zigs.length-1].data._repeat-1) );
				}else{
					mtd = 0
				}
	
			}else{
				mtd = 0;
			}

			var startAt = parseInt(syncAt*1000)/1000;
			var bias = ( parseInt(mtd*1000)/1000 )+startAt;
			this.add(q,'+='+bias);
		} 

		// -------------------
		// RETURN
		// -------------------
		this.zigs.push(q);
		return this;
	};
	TimelineLite.prototype.mouse = function(trigger,tog,method){
		
		var _t = this;

		console.log(_t)

		if(tog){
			this.data._toggle = true;
		}else{
			this.data._toggle = false;
		};

		// Set Trigger
		if(trigger === 'self' || trigger === undefined){
			_t.data._trigger = _t.node;
		}else if(typeof trigger === 'string'){
			_t.data._trigger = nodeSelector(trigger);
		};

		// Set Mouse Mode
		for(var i in _t.data._trigger){
			
			switch(method){

				case 'click':
					if(_t.data._toggle){
						_t.data._trigger[i].onmousedown = function(){
							toggle.apply(this,[_t]);
						};
					}else{
						_t.data._trigger[i].onmousedown = function(){
							execute.apply(this,[_t]);
						};
					}
				break;

				case 'rollover':
					if(_t.data._toggle){
						_t.data._trigger[i].onmouseover = function(){
							if(_t._active){
								halt.apply(this,[_t]);
							}else{
								execute.apply(this,[_t]);
							}
						}
						_t.data._trigger[i].onmouseout = function(){
							if(_t._active){
								halt.apply(this,[_t]);
							}else{
								execute.apply(this,[_t]);
							}
						};
					}else{
						_t.data._trigger[i].onmouseover = function(){
							if(_t._active){
								halt.apply(this,[_t]);
							}else{
								execute.apply(this,[_t]);
							}
						};
					}
				break;

			}
		}

		return _t;
	};

	/*
	Each Jig, Zig and Ziggle Object has a data object, provided by TimelineLite, 
	a '_complete' boolean is in each one, this was added to allow looping and prevent animation stacking.
	*/

	// Here we extend some of TimelineLite's native functions to include variables needed to handle jigs and zigs.
	TimelineLite.prototype.play = (function(_super){
		return function(){
			this._active = true;
			return _super.apply(this,arguments);
		};
	})(TimelineLite.prototype.play);

	TimelineLite.prototype.pause = (function(_super){	
		return function(){
			this._active = false
			return _super.apply(this,arguments);
		}
	})(TimelineLite.prototype.pause);


	// This function was built to allow you to add a TimelineLite instance ANYWHERE on an already instatiated TimelineLite instance.
	TimelineLite.prototype.sync = function(child,time){	
		var s = parseInt(time*1000)/1000;
		var td = this.totalDuration();
		var g;

		if(td == s){
			g = td-s;
			this.add(child,'+='+g);
		}else if(td>s){	
			g = td-s;
			this.add(child,'-='+g);
		}else if(td<s){	
			g = time-td;
			this.add(child,'+='+g);
		}
	};


	// These functions are _complete status dependent and standalone
	function toggle(_t){
		if(_t._active){
			halt(_t);
		}else{
			execute(_t);
		}	
	};
	function execute(_t){
		if(_t.data._complete){	
			_t.data._complete = false;
			_t._active = true;
			_t.restart();	
		}else{	
			if(!_t._active){
				_t._active = true;
				_t.play();
			}
		}

		console.log(_t)
	};
	function halt(_t){
			
			if(_t._active){
				_t._active = false;
				_t.pause();
			}

		console.log(_t)
	};

	//===========================================================
	// PRIVATE CONSTRUCTORS
	//===========================================================

	function Zig(settings){
		
		var q = new TimelineLite();
		q.defaultOverwrite = 'none';

		// Ziggle information
		// -----------------
		q.ziggles = [];

		// Zig Data
		// -----------------
		q.data = {
			
				_nodeType:'ZIG',
				// Timeline setup
				_name:undefined,
				_parent:undefined,
				_preset:undefined,

				_latestZiggle:0,

				//relative
				_amplitude:undefined,
				_life:undefined,

				//timing
				_stagger:0,
				_speed:undefined,
				_ease:undefined,

				//transform
				_origin:undefined,
				_density:undefined,

				//scale
				_scale:undefined,
				_startScale:undefined,
				_endScale:undefined,
				_startHeight:undefined,
				_endHeight:undefined,
				_startWidth:undefined,
				_endWidth:undefined,

				//rotation 2D
				_rotation:undefined,
				_startRotation:undefined,
				_endRotation:undefined,

				//location 2D
				_x:undefined,
				_y:undefined,
				_startX:undefined,
				_startY:undefined,
				_endX:undefined,
				_endY:undefined,

				//rotation 3D
				_rotationX:undefined,
				_rotationY:undefined,
				_rotationZ:undefined,

				_startRotationX:undefined,
				_startRotationY:undefined,
				_startRotationZ:undefined,

				_endRotationX:undefined,
				_endRotationY:undefined,
				_endRotationZ:undefined,

				//location 3D
				_z:undefined,
				_startZ:undefined,
				_endZ:undefined,

				//opacity
				_opacity:undefined,
				_startOpacity:undefined,
				_endOpacity:undefined,
				
				//repeat
				_reps:0,
				_repeat:0
		};
		// some data needs to be set.
		q.settingsOverwrite = [];
		q.data = replaceSettings(q,settings,q.data);

		// -------------------------------
		// RETURN
		// -------------------------------
		return q;
	};
	function Ziggle(settings){
		
		var q = new TimelineLite();
		q.defaultOverwrite = 'none';

		// Ziggle Data
		// -----------------
		q.data = {
			
				_nodeType:'ZIGGLE',
				// Timeline setup
				_name:undefined,
				_parent:undefined,
				_preset:undefined,

				//timing
				_cd:0,

				//repeat
				_reps:0,
				_repeat:0,

				//CSS Properties
				_height:0,
				_width:0,

				//switches
				_boolean:false
		};

		q.settingsOverwrite = [];
		q.data = replaceSettings(q,settings,q.data);

		//loop
		q.loop = function(i){

			var looping = false;

			var thisJig = q.data._parent.data._parent
			var thisZig = q.data._parent

			// -------------------------------------------
			// Set Iteration Duration
			// -------------------------------------------
			if(thisZig.data._td === undefined){
				thisZig.data._td = thisZig.totalDuration();
			}

			// -------------------------------------------
			// Set Zig Rep status, 
			// Runs after LAST Ziggle in it's Zig calls this function
			// -------------------------------------------
			if(this.data._id[1] === this.data._parent.ziggles.length-1){
				thisZig.data._reps++
			}

			// -------------------------------------------
			// Looping?
			// -------------------------------------------
			if(this.data._id[0] === thisJig.lastZiggle){
				looping = true;
			}

			// -------------------------------------------
			// Handle Need to Loop a Ziggle
			// -------------------------------------------
			var g = q.data._reps;
			var r = q.data._repeat-1;

			if( r > g ){
				
				q.data._reps++;
				q = thisZig.data._preset[0].apply(q,q.data._presettings);
			
			}else{
				thisZig.data._complete = true;
				thisZig._active = false; 
			}

			// -------------------------------------------
			// Loops Complete?	
			// -------------------------------------------
			var jDur = thisJig.totalDuration();
			var jTime = thisJig.time();
			if(jDur === jTime && this.data._id[1] === (thisJig.node.length-1) ){
				thisJig.data._complete = true;
				thisJig._active = false;
				q.data._td = undefined;
				q.data._reps = 0;
						console.log('====> Jig Complete: '+thisJig.data._name+' ---- zigs: '+this.data._id)
			}

		};
		
		// -------------------------------
		// RETURN
		// -------------------------------
		return q;
	};
	function ZigAnimation(jig,behavior,preset,settings){

		var timeline,
			stagger,
			duration;

		var loops = offset = stagger = 0

		// -------------------------------
		// Zig Creation
		// -------------------------------
		var q = new Zig(settings);

		// -------------------------------
		// Preset Assignment & Settings
		// -------------------------------
		q.data._preset = new Preset(behavior,preset);
		q.data = filterSettings(q,q.data._preset[1],q.data);

		// -------------------------------
		// Zig Settings
		// -------------------------------
		q.data._parent = jig;
		q.data._id = jig.zigs.length;
		q.data._self = q;

		// -------------------------------
		// Ziggle Creation
		// -------------------------------
		offset = q.data._stagger;

		for(var n in jig.node){

				var ziggle = new Ziggle();

				// ------------------------------------------
				// Gather some computed CSS from the element
				// ------------------------------------------
				ziggle.data._height = parseInt( window.getComputedStyle(jig.node[n],null).getPropertyValue("height") );
				ziggle.data._width = parseInt( window.getComputedStyle(jig.node[n],null).getPropertyValue("width") );

				// ------------------------------------------
				// Make the ziggle
				// ------------------------------------------
				ziggle = q.data._preset[0].apply(this, [ziggle, q.data, jig.node[n], stagger, n]);


				// ------------------------------------------
				// Set some more data for the ziggle
				// ------------------------------------------
				ziggle.data._presettings = [ziggle,q.data,jig.node[n],0,n];
				ziggle.data._reps = q.data._reps;
				ziggle.data._repeat = q.data._repeat;
				ziggle.data._parent = q;
				ziggle.data._id = [jig.zigs.length,parseInt(n)];
				

				// -----------------------------------
				// Compute actual duration of ziggle
				// -----------------------------------
				if(q.data._repeat > 0){
					ziggle.data._cd = q.data._speed*q.data._repeat+stagger
				}else{
					ziggle.data._cd = q.data._speed
				}

				// -------------------------------
				// Stagger this ziggle if needed
				// -------------------------------
				if(offset === 'random'){
					stagger = Math.random();
				}else if(typeof offset ==='number'){
					stagger = parseInt(n)*offset;
				}


				// -------------------------------
				// Add ziggle to zig
				// -------------------------------
				q.add(ziggle,stagger);
				q.ziggles.push(ziggle);

		}

		// -------------------------------
		// RETURN
		// -------------------------------
		return q;
	};
	function ZigAnimation_custom(jig,func){

		var timeline,
			duration;

		// -------------------------------
		// Zig Creation
		// -------------------------------
		var q = new Zig();

		// -------------------------------
		// Preset Assignment & Settings
		// -------------------------------
		q.data._preset = 'none'

		// -------------------------------
		// Zig Settings
		// -------------------------------
		q.data._parent = jig;
		q.data._id = jig.zigs.length;
		q.data._self = q;

		// -------------------------------
		// Ziggle Creation
		// -------------------------------

		for(var n in jig.node){

				var ziggle = new Ziggle();

				// ------------------------------------------
				// Gather some computed CSS from the element
				// ------------------------------------------
				ziggle.data._height = parseInt( window.getComputedStyle(jig.node[n],null).getPropertyValue("height") );
				ziggle.data._width = parseInt( window.getComputedStyle(jig.node[n],null).getPropertyValue("width") );

				// ------------------------------------------
				// Set some more data for the ziggle
				// ------------------------------------------
				ziggle.data._parent = q;
				ziggle.data._id = [jig.zigs.length,parseInt(n)];
				
				ziggle = func.apply(this,[ ziggle,jig.node[n] ]);

				// -----------------------------------
				// Compute actual duration of ziggle
				// -----------------------------------
				ziggle.data._cd = ziggle.totalDuration();


				// -------------------------------
				// Add ziggle to zig
				// -------------------------------
				q.add(ziggle);
				q.ziggles.push(ziggle);

		}

		// -------------------------------
		// RETURN
		// -------------------------------
		return q;
	};


	//==================
	// PRIVATE FUNCTIONS
	//==================

	TimelineLite.prototype.ziggleTime = function(){


		if(this.data._td == undefined){
			this.data._td = this.totalDuration();
		}

		// Calculate Time in Ziggle fragment (loop)
		// ----------------------------------------
		var x = this.time();
		var y = this.totalDuration();
		var z = this.data._td;
		var r = this.data._reps;

		// KNOWN ISSUES
		// upon rstart r is equal to it's previous count?????

		var rr;

		if(r === 0){
			rr = x;
		}else{
			var c = z*r;
			rr = x-c;
		}
		// ----------------------------------------

		return Math.round(rr*1000)/1000;
	};
	nodeSelector = function(nodeString){

		function removePrefix(o){
			var arr=[];
			var name;
			var prefix;

			switch(o[0]){
					case '#':
						arr[1] = o.substr(1);
						arr[0] = o[0];
					break;
					case '.':
						arr[1] = o.substr(1);
						arr[0] = o[0];
					break;
					default:
						arr[1] = o;
						arr[0] = null;
					break;
			}

			return arr;
		};
		function findNode(prefix,name){
			
			var arr =[]
			var element;

			switch(prefix){
				// -------------------------------
				// If the prefix indicates an ID
				// -------------------------------
				case '#':
					arr = [document.getElementById(name)];
				break;
				// -------------------------------
				// If the prefix indicates a Class
				// -------------------------------
				case '.':
					element = Array.prototype.slice.call(document.getElementsByClassName(name));
					for(var i in element){
						arr.push(element[i]);
					}
				break;
				// -----------------------------------------
				// If the lack of a prefix indicates an Tag
				// -----------------------------------------
				default:
					try{
						element = Array.prototype.slice.call(document.getElementsByTagName(name));
						for(var i in element){
							arr.push(element[i]);
						}
					}catch(err){console.log('Selector is not valid, see documentation')};
				break;
			};

			return arr;
		};

		var DOM = document.body.childNodes;
		var n = nodeString;
		var splitN = n.split(' ');
		var thisNode;

		if(splitN.length < 2){

			//-------------------------------------------------------------
			// If we are not trying to get children of another DOM element
			//-------------------------------------------------------------
			var parent = removePrefix(splitN[0]);
			thisNode = findNode(parent[0],parent[1]);
			
		}else{

			// INCOMPLETE ***************************

			//-------------------------------------------------------------
			// If we are trying to get the children of another DOM element
			//-------------------------------------------------------------
			var parent = removePrefix(splitN[0]);
			var child = removePrefix(splitN[1]);

			var firstNode = findNode(parent[0],parent[1]);
			
			for(var i in firstNode){
				var nodes = firstNode[i].childNodes;
			}
		}


		// -------------------------------
		// RETURN
		// -------------------------------
		return thisNode;
	};
	filterSettings = function(parent,defaults,settings){

		var s = settings;

		for(var i in s){
			if(s[i] === undefined){
				for(var j in defaults){
					if(j === i){
						s[i] = defaults[j];		
					}
				}
			}
		}

		//-------------------------------------
		// Some Data is required for valid math
		//-------------------------------------
		for(var i in s){
			if(s[i] === undefined){
				s[i] = 0;
			}
		}
		
		return s;
	};
	replaceSettings = function(parent,passed,settings){

		var s = settings;

		for(var i in s){
			for(var j in passed){
				if('_'+j === i){
					s['_'+j] = passed[j];
					parent.settingsOverwrite.push('_'+j);
				}
			}	
		}	
		return s;
	};	
	settingOverwritten = function(parent,setting){
		for(var i in parent.settingsOverwrite){
			if(parent.settingsOverwrite[i] === setting){
				return true;
			}
		}
	}

	//==============================================
	// PRESETS
	//==============================================

	// --------------------------------------------------------------------
	// This is where you can access or create new presets for Jig to handle
	// --------------------------------------------------------------------
	var library = {

		// NOTE: Don't forget you can animate in 3D!

			wiggle:{
				// Pre-defined settings
				// -------------------
				defaults:{
					lively:{
						_speed:1, 
						_amplitude:10,
						_rotation:6,
						_origin:'50% 50%'
					},
					calm:{
						_speed:3, 
						_amplitude:3,
						_rotation:8,
						_origin:'50% 50%'
					},
					fever:{
						_speed:.2, 
						_amplitude:10,
						_rotation:0,
						_origin:'50% 50%'
					}
				},

				build:function(ziggle,v,actor,delay,index){

					// Your custom setting modifications
					var s=[
						v._speed/5,
						v._speed/5,
						v._speed/5,
						v._speed/5,
						v._speed/5
					];

					// Required
					// ----------------------------------------
					ziggle.call(function(){
						v._parent.data._latestZig = v._self;
						v._parent.data._latestZiggle = ziggle;
					});
					// ----------------------------------------

					// Your Animation
					ziggle.add(
						TweenLite.to(actor,s[0],{
							transformOrigin:v._origin,
							delay:delay,
							x:v._amplitude*-1,
							rotation:v._rotation*-1,
							ease:v._e
						})
					);

					ziggle.add(
						TweenLite.to(actor,s[1],{
							x:v._amplitude,
							rotation:v._rotation,
							ease:v._e
						})
					);

					ziggle.add(
						TweenLite.to(actor,s[2],{
							x:v._amplitude/2*-1,
							rotation:v._rotation/2*-1,
							ease:v._e
						})
					);

					ziggle.add(
						TweenLite.to(actor,s[3],{
							x:v._amplitude/2,
							rotation:v._rotation/2,
							ease:v._e
						})
					);

					ziggle.add(
						TweenLite.to(actor,s[4],{
							x:0,
							rotation:0,
							ease:v._e
						})
					);

					// Required
					// ----------------------------------------
					ziggle.call(function(){
						ziggle.loop(index);
					});
					// ----------------------------------------

					return ziggle;
				}
			},
			hop:{
				// Pre-defined settings
				// -------------------
				defaults:{
					lively:{
						_speed:1, 
						_amplitude:1,
						_rotation:15,
						_density:.7,
						_origin:'50% 100%' // ground
					}
				},

				build:function(ziggle,v,actor,delay,index){

					// Your custom setting modifications
					
					var s=[
						v._speed/6,
						v._speed/4,
						v._speed/5
					];


					// ---------------------------------------------------
					// if v._scale is = to 0 it will break the math below
					// ---------------------------------------------------
					if( !settingOverwritten(v._self,'_scale') ){
						v._scale = 1;
					}

					// ------------------------------------------------------------------
					/* 	
					We set the sum of our first speed variations to f and then we 
					set the last array value to be the remainder between the speed and f
					*/
					// ------------------------------------------------------------------
					var f = 0;
					for(var i in s){ f += s[i]; };
					s[3] = v._speed%f;

					// ---------------------------------------------------------------------------
					// We set a new amplitude which reflects the physical dimensions of the actor
					// ---------------------------------------------------------------------------
					var amp = (v._amplitude*-1)*ziggle.data._height;

					// ------------------------------------------------------------------------------
					// We want to make our actor rotate a bit in the air, but we want it to alternate
					// ------------------------------------------------------------------------------
					ziggle.data._boolean = ziggle.data._boolean ? false : true;
					var b = ziggle.data._boolean ? v._rotation+'deg' : (-1*v._rotation)+'deg';

					// ----------------------------------------
					// Required for looping
					// ----------------------------------------
					ziggle.call(function(){
						v._parent.data._latestZig = v._self;
						v._parent.data._latestZiggle = ziggle;
					});

					// ----------------------------------------
					// Assign animation to ziggle (timeline)
					// ----------------------------------------

					ziggle.add(
						TweenLite.to(actor,s[0],{
							scaleX:v._scale*1+(1-v._density),
							scaleY:v._scale*1-(1-v._density),
							transformOrigin:v._origin,
							ease:'easeIn'
						})
					);
					
					ziggle.add(
						TweenLite.to(actor,s[1],{
							scaleX:v._scale*1-(.9-v._density),
							scaleY:v._scale*1+(.9-v._density),
							y:amp,
							transformOrigin:v._origin,
							ease:'linearOut',
							rotation:b
						})
					);

					ziggle.add(
						TweenLite.to(actor,s[2],{
							scaleX:v._scale*.8+(1-v._density),
							scaleY:v._scale*1-(1-v._density),
							y:0,
							ease:'easeIn',
							rotation:0
						})
					);

					ziggle.add(
						TweenLite.to(actor,s[3],{
							scaleX:v._scale,
							scaleY:v._scale,
							y:0,
							ease:'linearOut'
						})
					);
					
					

					// ----------------------------------------
					// Required for looping
					// ----------------------------------------
					ziggle.call(function(){
						ziggle.loop(index);
					});

					// ----------------------------------------
					// RETURN
					// ----------------------------------------
					return ziggle;
				}
			},
			spin:{
				// Pre-defined settings
				// -------------------
				defaults:{
					lively:{
						_speed:1,
						_rotationZ:360,
						_origin:'50% 50%',
						_ease:'linear'
					}
				},

				build:function(ziggle,v,actor,delay,index){

					// Required
					// ----------------------------------------
					ziggle.call(function(){
						v._parent.data._latestZig = v._self;
						v._parent.data._latestZiggle = ziggle;
					});
					// ----------------------------------------

					if( settingOverwritten(v._self,'_rotation') ||
						settingOverwritten(v._self,'_rotationX') ||
						settingOverwritten(v._self,'_rotationY') ){

						v._rotationZ = v._rotation;
						
					}

					// Your Animation
					ziggle.add(
						TweenLite.to(actor,v._speed,{
							
							transformOrigin:v._origin,
							delay:delay,

							rotationX:'+='+v._rotationX,
							rotationY:'+='+v._rotationY,
							rotationZ:'+='+v._rotationZ,

							ease:v._ease
						})
					);

					ziggle.add(
						TweenLite.set(actor,{

							rotationX:0,
							rotationY:0,
							rotationZ:0

						})
					);

					// Required
					// ----------------------------------------
					ziggle.call(function(){
						ziggle.loop(index);
					});
					// ----------------------------------------

					return ziggle;
				}
			}

	};


	// ---------------------------------------------------------
	// This function returns an array with the preset requested
	// ---------------------------------------------------------
	Preset = function(type,vari){
		
		var p = [library[type].build];
		if(vari != undefined){
			vari = library[type].defaults[vari];
			p.push(vari)
		};

		return p;
	};



})(document);
