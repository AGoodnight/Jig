;(function(document){

/*
JIG COMPONENT for TimelineLite. 
Copyright 2014 Adam Goodnight, all rights reserved.

contributors:
Jason Rutherford

TimelineLite was created by Greensock
*/

/* 
"jigLite" is an add-on for GSAP TimelineLite. that does not require any additional libraries, so no JQuery.
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

/*TO DO
1. newVehicle();
	- returns a new div that encapsulates and shares the same css positioning data as the jig.node[index];
2. flyTo();
	- Moves a Jig node to another location via {x:0,y:0,z:0} or an elements css data ('#thesky');
3. bounce();
	- Adds a 'bounce'/additional tween to the node of a Jig.
*/

	//======
	// JIG
	//======
	jig = function(nodeString,settings){

		var q = new TimelineLite();
		
		q.data = {

			_nodeType:'JIG',
			// Timeline setup
			_name:'untitled',
			_startAt:0,
			_endAt:0,
			_timeline:undefined,
			_toggle:undefined,

			//timing
			_delay:0,
			_speed:undefined,

			//state
			_active:false
		};


		q.data = replaceSettings(settings,q.data);

		q.defaultOverwrite = 'none';
		q.type = 'jig'

		q.instances = [];
		q.nodeString = nodeString;
		q.node = nodeSelector(nodeString);
		q.target = undefined;

		q.startAt = 0;
		q.zigs = [];
		q.lastZiggle = undefined;

		q.pause();

		return q;	
	};

	//=====================
	// PUBLIC CONSTRUCTORS
	//=====================
	TimelineLite.prototype.wiggle = function(preset,settings,syncAt){
		return this.buildZig('wiggle',preset,settings,syncAt);		
	};
	TimelineLite.prototype.jump = function(preset,settings,syncAt){
		return this.buildZig('jump',preset,settings,syncAt);
	};
	TimelineLite.prototype.plop = function(preset,settings,syncAt){
		return this.buildZig('plop',preset,settings,syncAt);
	};

	// these are just handy

	TimelineLite.prototype.click = function(trigger,toggle){
		return this.mouse(trigger,toggle,'click');
	};
	TimelineLite.prototype.rollover = function(trigger,toggle){
		return this.mouse(trigger,toggle,'rollover');
	};

	TimelineLite.prototype.onComplete = function(func,delay){
		setTimeout(function(){
			func();
		},this.totalDuration()*1000)

		return this;
	};

	//================================================
	// PUBLIC FUNCTIONS/CONSTRUCTORS (ADVANCED USERS)
	//================================================
	TimelineLite.prototype.buildZig = function(type,pre,set,sa){	

		var settings, 
			preset, 
			syncAt;

		// Handle variation in passed arguments
		// ------------------------------------------------------
		if(typeof pre === 'string' && typeof set === 'object' && typeof sa === 'number'){
			preset = pre;
			settings = set;
			syncAt = sa;
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
		}
		// ------------------------------------------------------
		// end handle arguments

		var q = new ZigAnimation(this,type,preset,settings);
		
		// handle if syncAt is not defined
		// ------------------------------------------------------
		if(syncAt != undefined){
			this.add(q,syncAt);
		}else{
			this.add(q,this.startAt);
		}

		// startAt is set when the Zig is made within the ZigAnimation constructor
		this.startAt+=q.startAt;
		this.instances.push(q);

		// chaining
		// ------------------------------------------------------
		return this;
	};

	TimelineLite.prototype.mouse = function(trigger,tog,method){
		
		var _t = this;

		if(tog){
			this.data._toggle = true;
		}else{
			this.data._toggle = false;
		};


		// Set Trigger
		if(trigger === 'self' || trigger === undefined){
			_t.data._trigger = _t.node;
			console.log(_t.node)
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
							execute.apply(this,[_t]);
						}
						_t.data._trigger[i].onmouseout = function(){
							halt.apply(this,[_t]);
						};
					}else{
						_t.data._trigger[i].onmouseover = function(){
							execute.apply(this,[_t]);
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
			this.data._active = true;
			return _super.apply(this,arguments);
		};
	})(TimelineLite.prototype.play);

	TimelineLite.prototype.pause = (function(_super){	
		return function(){
			this.data._active = false
			return _super.apply(this,arguments);
		}
	})(TimelineLite.prototype.pause);


	// This function was built to allow you to add a TimelineLite instance ANYWHERE on an already instatiated TimelineLite instance.
	TimelineLite.prototype.sync = function(child,time){
		
		var s = parseInt(time*1000)/1000;
		var td = this.totalDuration();
		var g;

		if(td == s){
			g = td-s; //console.log('+='+g);
			this.add(child,'+='+g);
			//console.log('EQUAL TO --- '+jig.data.name+' --- '+zig.data.name+' --- '+jig.totalDuration());
		}else if(td>s){	
			g = td-s;//console.log('-='+g);
			this.add(child,'-='+g);
			//console.log('GREATER THAN --- '+jig.data.name+' --- '+zig.data.name+' --- '+jig.totalDuration());
		}else if(td<s){	
			g = time-td; //console.log('+='+g);
			this.add(child,'+='+g);
			//console.log('LESS THAN --- '+jig.data.name+' --- '+zig.data.name+' --- '+jig.totalDuration());
		}
	};


	// These functions are _complete status dependent and standalone
	function toggle(_t){
		if(_t.data._active){
			halt(_t);
		}else{
			execute(_t);
		}	
	};

	function execute(_t){
		if(_t.data._complete){	
			_t.data._complete = false;
			_t.data._active = true;
			_t.restart();	
		}else{	
			if(!_t.data._active){
				_t.data._active = true;
				_t.play();

				console.log(_t)
			}
		}
	};

	function halt(_t){
			
			if(_t.data._active){
				_t.data._active = false;
				_t.pause();
			}
	};

	//======================
	// PRIVATE CONSTRUCTORS
	//======================
	function Zig(settings){
		
		var q = new TimelineLite();
		q.defaultOverwrite = 'none';

		// Ziggle information
		// -----------------
		q.ziggles = [];
		q.zigglesComplete;
		q.zigglesDuration;

		// Zig Data
		// -----------------
		q.data = {
			
				_nodeType:'ZIG',
				// Timeline setup
				_name:undefined,
				_startAt:undefined,
				_endAt:undefined,
				_toggle:undefined,
				_parent:undefined,
				_preset:undefined,

				//relative
				_amplitude:undefined,
				_life:undefined,

				//timing
				_delay:0,
				_stagger:0,
				_speed:undefined,

				//transform
				_origin:'%50 %50',

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
				_repeat:undefined,

				//state
				_active:false,
				_toggled:false
		};

		q.data = replaceSettings(settings,q.data);

		//loop
		
		return q;
	};

	function Ziggle(settings){
		
		var q = new TimelineLite();
		q.defaultOverwrite = 'none';

		// Ziggle information
		// -----------------
		var Complete = false;
		var Duration = undefined;

		// Zig Data
		// -----------------
		q.data = {
			
				_nodeType:'ZIGGLE',
				// Timeline setup
				_name:undefined,
				_parent:undefined,
				_preset:undefined,

				//repeat
				_reps:0,
				_repeat:0,

				//state
				_active:false
		};

		q.data = replaceSettings(settings,q.data);

		//loop
		q.loop = function(i){

			var looping = false;

			var thisJig = this.data._parent.data._parent
			var thisZig = this.data._parent

			var g = this.data._reps;
			var r = this.data._repeat;

			if( r > g ){
				
				this.data._reps++;
				var func = thisZig.data._preset[0].apply(this,this.data._presettings)
			
			}else{
				thisZig.data._complete = true;
				thisZig.data._active = false;
					//	console.log('++++> Zig Complete: '+thisZig.data._name)
			}

			var jDur = thisJig.totalDuration();
			var jTime = thisJig.time();


			if(this.data._id[0] === thisJig.lastZiggle){
				looping = true;
			}
			thisJig.lastZiggle = this.data._id[0];

			if(jDur === jTime && this.data._id[1] === (thisJig.node.length-1) ){
				thisJig.data._complete = true;
				thisJig.data._active = true;
						console.log('====> Jig Complete: '+thisJig.data._name+' ---- zigs: '+this.data._id)
			}

		};
		
		return q;
	};

	function ZigAnimation(jig,behavior,preset,settings){

		var timeline;
		var q = new Zig(settings);
		q.data._parent = jig;
		var stagger;
		var duration;
		// Local variables
		// ------------------------
		var loops = offset = stagger = 0

		q.data._preset = new Preset(behavior,preset);
		q.data = filterSettings(q.data._preset[1],q.data); 
		q.startAt = 0;

		var offset = q.data._stagger;
		
		var actor;
		


			for(var n in jig.node){

				//if(jig.zigsAnimating){
					actor = newVehicle(jig.node[n],'name');
					console.log(actor)
			//	}else{
				//	actor = jig.node[n];
				//}

				var ziggle = new Ziggle();
				ziggle = q.data._preset[0].apply(this, [actor, ziggle, q, n, jig, stagger]);
				ziggle.data._presettings = [ziggle,q,n,jig,0];
				ziggle.data._reps = q.data._reps;
				ziggle.data._repeat = q.data._repeat;
				ziggle.data._parent = q;
				ziggle.data._id = [jig.zigs.length,parseInt(n)];
				
				if(offset === 'random'){
					stagger = Math.random();
				}else if(typeof offset ==='number'){
					stagger = parseInt(n)*offset;
				}

				q.add(ziggle,stagger);
				q.ziggles.push(ziggle);

			}

			if(q.data._repeat > 0){
				q.startAt = q.totalDuration()*q.data._repeat
			}else{
				q.startAt = q.totalDuration()
			}

			jig.zigs.push(q);
		
		return q;
	};

	//==================
	// PRIVATE FUNCTIONS
	//==================
	nodeSelector = function(nodeString){
		//https://developer.mozilla.org/en-US/docs/Web/API/document.querySelectorAll

		var DOM = document.body.childNodes

		function removePrefix(o){
			var arr=[];
			var name;
			var prefix;

			switch(o[0]){
					// if an id
					case '#':
						arr[1] = o.substr(1);
						arr[0] = o[0];
					break;
					//if a class
					case '.':
						arr[1] = o.substr(1);
						arr[0] = o[0];
					break;
					//if a tag or anything else
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
				// if an id
				case '#':
					arr = [document.getElementById(name)];
				break;
				//if a class -- this is acting funny
				case '.':
					element = Array.prototype.slice.call(document.getElementsByClassName(name));
					for(var i in element){
						arr.push(element[i]);
					}
				break;
				//if a tag or anything else
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

		var n = nodeString;
		var splitN = n.split(' ');
		var thisNode;

		if(splitN.length < 2){

			// simple selection
			var parent = removePrefix(splitN[0]);
			thisNode = findNode(parent[0],parent[1]);
			
		}else{
			// looking for node inside a parent
			var parent = removePrefix(splitN[0]);
			var child = removePrefix(splitN[1]);

			var firstNode = findNode(parent[0],parent[1]);
			
			//console.log('Elements ------')
			
			for(var i in firstNode){
				var nodes = firstNode[i].childNodes;
				//console.log(nodes)
			}
		}

		return thisNode;
	};
	filterSettings = function(defaults,settings){

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
		
		return s;
	};
	replaceSettings = function(passed,settings){

		var s = settings;

		for(var i in s){
			for(var j in passed){
				if('_'+j === i){
					s['_'+j] = passed[j];

				}
			}
			
		}
		
		return s;
	};	
	newVehicle = function(passenger,name){

		console.log(passenger)
		var thisDiv = passenger.cloneNode(true);
		thisDiv.
		console.log(thisDiv.style)
		thisDiv.id = name;
		
		passenger.parentNode.appendChild(thisDiv);
		passenger.parentNode.removeChild(passenger);
		thisDiv.appendChild(passenger);

		return thisDiv;
	}

	//=========
	// PRESETS
	//=========
	var library = {
			// Most presets will support 3D transform
			wiggle:{
				// Pre-defined settings
				// -------------------
				defaults:{
					lively:{
						_speed:1, 
						_amplitude:10,
						_rotation:20,
						_origin:'50% 50%',
						_repeat:0
					},
					calmly:{
						_speed:3, 
						_amplitude:3,
						_rotation:8,
						_origin:'50% 50%',
						_repeat:0
					},
					feverishly:{
						_speed:.2, 
						_amplitude:10,
						_rotation:0,
						_origin:'50% 50%',
						_repeat:5
					}
				},

				build:function(actor,ziggle,zig,index,jig,delay){

					// our settings represented by a simple 'v'
					// ---------------------------------------
					v = zig.data;
					//console.log('repeat: '+v._repeat)

					// our total duration split into the neccessary chunks
					// ---------------------------------------------------
					s = [
						v._speed/8,
						v._speed/7,
						v._speed/6,
						v._speed/5,
						v._speed/4
					];

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
					ziggle.call(function(){
						ziggle.loop(index);
						//console.log(ziggle)
					})

					return ziggle;
				}
			},
	};
	Preset = function(type,vari){
		
		var p = [library[type].build];
		if(vari != undefined){
			vari = library[type].defaults[vari];
			p.push(vari)
		};

		return p;
	};
	



})(document);
