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

		q.instancs = [];
		q.defaultOverwrite = 'none';
		q.type = 'jig'

		q.nodeString = nodeString;
		q.node = nodeSelector(nodeString);
		
		// Used for Toggle and paused Jigs
		// -------------------------------
		if(trigger !== undefined){
			q.trigger = nodeSelector(trigger);
		}else{
			q.trigger = q.node;
		}

		return q;	
	};

	//ZUGS & ZIGS
	//===========================

	TimelineLite.prototype.zig = function(preset,settings,sync){	
		
		var q = new Zig(preset,settings,sync);

		// Local variables
		// ------------------------
		var wait, index = 0;
		var loops = 0;


		// Looping
		// ------------------------
		loops = q.data._repeat;

		// Set a Ziggle for each node in Jig
		// ------------------------
		for(var i in this.node){
			if(typeof this.node[i] === 'object'){

				var at;
				var ziggle = new Ziggle();
				
				// Determine how many instances of the Zig we need
				// ------------------------------------------------
				for(var i = 0 ; i<loops ;i++ ){

					var timeline = new preset.build(ziggle,index,jig,wait);
					ziggle.add(timeline);

				}


				if(q.data._startAt !== undefined){
					at = ziggle._stagger * i;
				}else{
					at = q.data._startTime + ziggle._stagger * i;
				}

				q.sync(ziggle,at);

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


	//CONSTRUCTORS
	//============================
	function Zig(){
		
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
				_preset:library[preset],

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

				//state
				_active:false,
				_toggled:false
		};
		
		return q;
	};

	function Ziggle(){

		var q = new TimelineLite();
		q.immediateRender = false;
		q.defaultOverwrite = 'none';

		q.data = {
			
			_type:'ZIGGLE',
			_repeat:0,
			_reps:0,
			_active:false
		
		};

		return q;
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
