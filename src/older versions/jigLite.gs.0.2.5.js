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

/*To Do
1. Parent Child Selector functionality
*/

	
	//JIG
	//===========================
	Jig = function(nodeString,trigger){
		var q = new SimpleTimelineLite('jig');

		q.data = jigNodes();
		q.nodeString = nodeString;
		q.node = nodeSelector(nodeString);
		
		if(trigger !== undefined){
			q.trigger = nodeSelector(trigger);
		}else{
			q.trigger = q.node;
		}

		return q;	
	};

	//ZUGS & ZIGS
	//===========================
	
	TimelineLite.prototype.auto = function(preset,settings,sync){	
		
		// Local variables
		// ------------------------
		var wait, index = 0;
		var jig = this;
		var loops = 0;

		// Zug construction
		// ------------------------
		var q = jig.filterArgs(settings,sync);

		// Modify passed values
		// ------------------------
		preset = library[preset];
		q.data = modify(preset.defaults,q.data);
		//q.data = settings;

		// Zug nodes
		// ------------------------
		q.zigs = [];
		q._childCounter = 0;
		q._zigsDuration = 0;
		q.data._parent = jig;

		// Looping
		// ------------------------
		loops = q.data._repeat;


		// Set Animations for each node in Jig
		// ------------------------
		for(var i in this.node){
			if(typeof this.node[i] === 'object'){

				// Create a Zig for the Zug
				// ---------------------------------------
				

				console.log(g)
				//var zig = q
				
				// Determine how many instances of the Zig we need
				// ------------------------------------------------
				for(var i = 0 ; i<loops ;i++ ){

					var timeline = new preset.build(zig,index,jig,wait);

					//timeline.play();

					
					if(q.data._startAt !== undefined){
						q.sync(timeline,0);
					}

					q.play();
					
				}

				wait+=q.data._stagger;
				index++
				//q.pause();
				/*g.push();
				
				q.preset = library.find(preset);
				
				
				
				q.zigs.push(g[index]);

				if(q._zigsDuration === 0){
					q._zigsDuration = q.zigs[index]._totalDuration;
				}else{
					if(q.data._stagger != undefined){
						var f = q.zigs[index]._totalDuration*q.data._stagger;
						q._zigsDuration+=f;
					};
				};

				if(g[index].data === undefined){
					q.sync(g[index],0);
				}else{
					q.sync(g[index],g[index].data._startAt);
				};

				index++;
				wait+=q.data._stagger;*/

			}
		};

		jig.sync(q,0);
		//q.toggle(settings);

		q.id = jig.instances.length;
		jig.instances.push(q);

		return jig;	
	};

	/*TimelineLite.prototype.toggle = function(preset,settings,sync){

		var jig = this;
		var q = jig.filterArgs(preset,settings,sync);

		if(q.data === undefined){
			jig.sync(q,0);
		}else{
			jig.sync(q,q.data._startAt);
		}

		q.id = jig.instances.length;
		jig.instances.push(q);
		q.preset = library.find(preset);
		q.preset(q,jig);

		return jig;	

	};*/
	//rollover
	//rollout
	//click
	//scrub
	
	//until( condition )
	TimelineLite.prototype.until = function(condition,action,settings){
		// loop or pause
		var q;

		/*if(action === 'loop'){
			this.data._repeat = 'forever'
		};*/

		if(action === 'pause' || action === undefined){
			
			var wait=0;

			for(var i in this.instances){
				wait+=this.instances[i]._zigsDuration*this.instances[i].data._repeat
				console.log('wait: '+wait);
			}

			this.call(
				function(){
					this.pause();
					console.log('paused');
				},
				null,
				this,
				wait
			);

			
		};

		/*if(typeof action === 'string' && action != 'loop'){
			q = jig.filterArgs(action,settings);
			q.id = jig.instances.length;
			jig.instances.push(q);
			q.preset = library.find(preset);
			q.preset(q,jig);
		}*/

		this.until_Interval = setInterval( function(){

			//console.log(window.rabbit)
			if(condition){

				console.log('condition met');
				this.data._repeat = 0;
				this.data._reps = 0;

				this.play();

				clearInterval(this.until_Interval);

			}

		}.bind(this),100)

		return this;
	};

	//trigger
	TimelineLite.prototype.onClick = function(func){

		for(var i in this.node){
			this.node[i].onclick = function(){
				func();
			}
		}

		return this;
	};


	//PROTOTYPES
	//===========================

	TimelineLite.prototype.toggle = function(settings){

		if(settings.toggle != undefined){
			this.data.toggle = settings.toggle;
			
			if(this.data.toggle){
				
				var trigger = this.data._parent.trigger;

				for(var i in trigger){

					trigger[i].onclick = function(){
						if(this.data._toggled === true){
							this.pause();
							this.data._toggled = false;
							console.log('zug is: '+this.data._toggled)
						}else{
							this.play();
							this.data._toggled = true;
							console.log('zug is: '+this.data._toggled)
						}
					}.bind(this);

				}

			}
		};
	};

	TimelineLite.prototype.filterArgs = function(settings,sync){
		
		var q;

			if(typeof settings == 'number' || typeof settings == 'string'){
				q = new ExtendedTimelineLite('zig',settings,sync);
			}

			if(typeof settings == 'object'){
				q = new ExtendedTimelineLite('zig',settings,sync);
			}

			if(settings === undefined){
				q = new SimpleTimelineLite();
			}

		return q
	};

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

	TimelineLite.prototype.setJigNode = function(node,value){ 
		var nodes = this.data;
		if(nodes.hasOwnProperty('_'+node)){
			nodes['_'+node] = value;
		}
	};

	/*TimelineLite.prototype.loop = function(jig,zig,zug,index){
		if( zig.data._repeat > (zig.data._reps+1) || zig.data._repeat === 'forever' ){
			zig.data._reps++
			jig.preset(zig,index,jig);
		}else{
			zig.data._reps = 0;
			zig._active = false;
			console.log('zig is !active');
		}

		for(var i in zug.zigs){
			if(!zug.zigs[i]._active && zug.childCounter < zug.zigs.length){
				zug.childCounter++
				console.log(zug.childCounter)
			};
		};

		if(zug.childCounter > zug.zigs.length-1){
			zug._active = false
			console.log('zug is !active');
		}

	};*/

	//CONSTRUCTORS
	//============================

	SimpleTimelineLite = function(type){
		var lite = new TimelineLite();

		if(type === 'jig'){
			lite.data = new jigNodes();
			lite.instances = []; // keep track of how many times the DOM object is given a chain of constructors
			lite.defaultOverwrite = 'none';	
		}

		if(type === 'zig'){
			lite.data = new zigNodes();
		}

		lite.type = type;

		return lite;
	};

	ExtendedTimelineLite = function(type,settings,sync){
		
		var lite = new TimelineLite();
		lite.type = type;
		lite.defaultOverwrite = 'preexisiting';	
		lite.data = {};
		
		// Settings
		// ----------------------------
		if(type === 'zig'){
			lite.data = new zigNodes();
			if(settings != undefined){
				if(typeof settings === 'object'){
					lite.data = zigNodes(settings);
				}
			}
		}
		// Syncing
		// ----------------------------
		if( typeof settings === 'string' || typeof settings === 'number' ){
			lite.data._startAt = settings;
		}
		if( typeof settings === 'object' ){
			for(var i in settings){
				if(lite.data.hasOwnProperty('_'+i)){
					lite.data['_'+i] = settings[i];
				}
			}

			if(sync!=undefined){
				if(typeof sync === 'object'){
					for(var i in sync){
						console.log(i)
						if(lite.data.hasOwnProperty('_'+i)){
							lite.data['_'+i] = settings[i];
						}
					}
				}
				if(typeof sync === 'number' || typeof sync === 'string'){
					lite.data._startAt = sync
				}
			}
		}



		return lite;
	};
	// Jig nodes are the data types needed to make the Jig object work
	jigNodes = function(cmnd){
		
		nodes = {
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
		if(typeof cmnd === 'object'){
		// behaves like a 'set' function
		// -----------------------------------
			for(var j in cmnd){
				if(nodes.hasOwnProperty(j+'')){
					nodes[j] = cmnd[j];
					}
			}
			return nodes;
		// -----------------------------------
		}

		if(cmnd === undefined){
			// -----------------------------------
			return nodes;
			//-----------------------------------
		}
	};
	// Zig nodes are the data types needed to perform the actual animations in the jig object
	zigNodes = function(cmnd){
		nodes = {
				_nodeType:'ZIG',
				// Timeline setup
				_name:undefined,
				_startAt:undefined,
				_endAt:undefined,
				_preset:undefined,
				_toggle:undefined,
				_parent:undefined,
				
				//relative
				_amplitude:undefined,
				_life:undefined,

				//timing
				_delay:undefined,
				_stagger:undefined,
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
				_repeat:0,
				_reps:[0],

				//state
				_active:false,
				_toggled:false
		};
		// -----------------------------------
		if(typeof cmnd === 'object'){
		// behaves like a 'set' function
		// -----------------------------------
			for(var j in cmnd){
				if(nodes.hasOwnProperty('_'+j)){
					nodes['_'+j] = cmnd[j];
				}
			}
			return nodes;
		// -----------------------------------
		}

		if(cmnd === undefined){
			// behaves like a 'constructor' function
			// -----------------------------------
			return nodes;
			//-----------------------------------
		}
	};


	//FUNCTIONS
	//============================
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
	modify = function(defaults,settings){

		for(var i in settings){
			if(settings[i] === undefined){
				for(var j in defaults){
					if(j === i){
						settings[i] = defaults[j];
					}
				}
			}
		}
		
		return settings;
	};

	//PRESETS
	//============================
	var library = {
			// Most presets will support 3D transform
			wiggle:{
				// Pre-defined settings
				// -------------------
				defaults:{
					_speed:1, 
					_amplitude:10,
					_rotation:20,
					_origin:'50% 50%'
				},

				build:function(zig,index,jig,delay,id){

					target = jig.node[index];

					// our settings represented by a simple 'v'
					// ---------------------------------------
					v = zig.data;
					console.log(v)

					// our total duration split into the neccessary chunks
					// ---------------------------------------------------
					s = [
						v._speed/5,
						v._speed/5,
						v._speed/5,
						v._speed/5,
						v._speed/5
					];

					zig.pause();

					zig.call(function(){
						console.log('zig is active');
						this._active = true;
					});

					zig.add(
						TweenLite.to(target,s[0],{
							transformOrigin:v._origin,
							delay:delay,
							x:v._amplitude*-1,
							rotation:v._rotation*-1,
							ease:v._e
						})
					);

					zig.add(
						TweenLite.to(target,s[1],{
							x:v._amplitude,
							rotation:v._rotation,
							ease:v._e
						})
					);

					zig.add(
						TweenLite.to(target,s[2],{
							x:v._amplitude/2*-1,
							rotation:v._rotation/2*-1,
							ease:v._e
						})
					);

					zig.add(
						TweenLite.to(target,s[3],{
							x:v._amplitude/2,
							rotation:v._rotation/2,
							ease:v._e
						})
					);

					zig.add(
						TweenLite.to(target,s[4],{
							x:0,
							rotation:0,
							ease:v._e
						})
					);

					return zig;
				}
			},


	};



})(document);
