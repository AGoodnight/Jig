;(function(document,window){

	// Jig makes an object where animation execution requests are anchored.
	jig = function(){
		
		var q = new TimelineLite({paused:true});
		q.nodeStrings = [];
		q.nodes = [];
		q.data={
			_virgin:true,
			_active:false,
			_complete:false
		};

		for(var i in arguments){
			if(typeof arguments[i] ==='string'){
				q.nodeStrings.push(arguments[i]);
				q.nodes.push(getNode(arguments[i]));
			}else if(typeof arguments[i] === 'object'){
				
				for(var j in arguments[i]){
					if(j === 'name'){
						q._name = arguments[i][j]
					}else{
						q.data[j] = arguments[i][j]
					}

				}

			}	
		}

		q.zigs = {};
		q.zigsArr = [];
		q.instances = 0;

		return q;
	};

	// Here we are extending some of TimelineLite's built-in functions
	// ---------------------------------------------------------------
	TimelineLite.prototype.play = (
		function(_super){
			return function(){
				this.data._active = true;
				this.data._virgin = false;
				return _super.apply(this,arguments);
			}
		}
	)(TimelineLite.prototype.play);

	TimelineLite.prototype.pause = (
		function(_super){
			return function(){
				this.data._active = false;
				return _super.apply(this,arguments);
			}
		}
	)(TimelineLite.prototype.pause);

	TimelineLite.prototype.restart= (
		function(_super){
			return function(){
				this.data._active = true;
				this.data._complete = false;
				return _super.apply(this,arguments);
			}
		}
	)(TimelineLite.prototype.restart);


	// --------------------
	// PUBLIC CONSTRUCTORS
	// --------------------

	// These are your jig options ( ex. jig().hop(); )

	TimelineLite.prototype.hop = function(){
		return this.zigInstance('hop',arguments);
	};

	// jig().hop().click()
	// If a click order is executes it binds the jig objects timeline to a click event

	TimelineLite.prototype.click = function(){
		return this.mouseEvent('click',arguments);
	};

	// similar to click, except rollover, 
		//a good use for this would be to produce a button which remains hopping whilst you are hovering over it.

	TimelineLite.prototype.rollover = function(){
		return this.mouseEvent('rollover',arguments);
	}

	// a blank check, where you can write a native timelinelite timeline
	TimelineLite.prototype.zig = function(){
		return this.zigInstance('custom',arguments)
	};


	// Core Constructors
	// ------------------

	TimelineLite.prototype.zigInstance = function(type,a){

		// -----------------------------------------------------------------------------------------
		// Set-up this Zig instance
		// -----------------------------------------------------------------------------------------	
		args = handleArguments(a);
		var preset = type;
		var delay = args[1];
		var options = args[2];
		var timeline = args[4];

		if(delay === undefined){
			delay = 0;
		}

		var stagger;
		var ziggleId = -1;

		this.instances++

		var jig = this;
		var zig = new TimelineLite();


		if(preset !== 'custom'){
				
			if(options != undefined){
				zig.data = filter(options,getPreset(preset).options);
			}else{
				zig.data = getPreset(preset).options
			};

			if(options != undefined && !!options._name){
				zig._name = options._name
			}else{
				zig._name = preset+'_'+this.zigsArr.length
			}

		}else{

			zig.data = {};

			if(options != undefined){
				zig.data = options
			}

			zig.data = filter(zig.data,{_reps:0})

			if(options != undefined && !!options._name){
				zig._name = options._name
			}else{
				zig._name = preset+'_'+this.zigsArr.length
			}

		}


		var ziggleArr = [];
		zig._id  = this.instances-1

		// -----------------------------------------------------------------------------------------
		// Create the Ziggles inside this Zig
		// -----------------------------------------------------------------------------------------
		for(var i in this.nodes){

			// -----------------------------------------------------------
			// Selecting classes and tags can result in groups of Ziggles
			// -----------------------------------------------------------
			var ziggleGroup;
			var ziggle;

			if(this.nodes[i].length > 1){
				
				ziggleGroup = new TimelineLite();

				for(var j in this.nodes[i]){
						
					ziggleId++ ; stagger = calcStagger(zig,j);
					
					// Create a Ziggle
					if(timeline !== undefined){
						ziggle = new TimelineLite();
						ziggle = timeline(ziggle,this.nodes[i][j]);
					}else{
						ziggle = new Ziggle(this,ziggleId,zig,preset,zig.data,this.nodes[i][j],stagger);
					}

					// Data
					ziggleArr.push(timelineData(ziggle,{
						actor:this.nodes[i][j],
						delay:stagger
					}));


					ziggleGroup.add(ziggle,stagger);
				}

			// ------------------------------------------------
			// Selecting IDs results in one ziggle for that ID
			// ------------------------------------------------
			}else{
				
				ziggleId++ ; stagger = calcStagger(zig,i);
				
				// Create a Ziggle
				if(timeline !== undefined){
					ziggle = new TimelineLite();
					ziggle = timeline(ziggle,this.nodes[i][0]);
				}else{
					ziggle = new Ziggle(this,ziggleId,zig,preset,zig.data,this.nodes[i][0],stagger);
				};

				// Data
				ziggleArr.push(timelineData(ziggle,{
					actor:this.nodes[i],
					delay:stagger
				}));

				ziggleGroup = ziggle;
				
			}

			// Add ZiggleGroup to Zig
			if(delay !== undefined){
				zig.add(ziggleGroup,delay);
			}else{
				zig.add(ziggleGroup,0);
			};

			zig.call(function(){
				if( jig.time() === jig.totalDuration() ){
					jig.data._complete = true;
				}
			});
		}

		// -----------------------------------------------------------------------------------------
		// Assigning data objects to our Jig
		// -----------------------------------------------------------------------------------------
		
		// Create dot syntax access to zig from jig
		// ----------------------------------------
		if(!!this.zigs[zig._name]){
			this.zigs[zig._name+'_'+ parseInt(this.instances-1)] = timelineData(zig,{ziggles:ziggleArr});
		}else{
			this.zigs[zig._name] = timelineData(zig,{ziggles:ziggleArr});
		}

		// Create array access to zig from jig
		// -----------------------------------
		this.zigsArr.push(
			timelineData(zig,{ziggles:ziggleArr})
		);

		// We add the zig to our jig
		// -------------------------
		this.add(zig);
		return this;
	};

	TimelineLite.prototype.mouseEvent = function(type,a){

		var jig = this;

		var handleThese = Array.prototype.slice.call(a);

		handleThese = handleArguments(handleThese);
		var toggle = handleThese[3];
		var trigger;
		// make sure we have a trigger
		// ---------------------------
		if(handleThese[0] === undefined){
			trigger = [];
			for(var i in this.nodes){
				if(this.nodes[i].length>1){
					for(var j in this.nodes[i]){
						trigger.push(this.nodes[i][j]);
					}
				}else{
					trigger.push(this.nodes[i][0]);
				}
			}
		}else{
			trigger = getNode(handleThese[0]);
		}

		// make sure the cursor indicates it can be clicked
		// ------------------------------------------------
		for(var i in trigger){
			trigger[i].style.cursor = 'pointer'
		}

		// our primary mouse functions
		// ---------------------------
		function onOff(){
			if(toggle){
				if(jig.data._active){
					jig.pause();
				}else{
					jig.play();
				}
			}

			if(jig.data._complete){
				jig.restart();
			}

			if(jig.data._virgin){
				jig.play();
			}
		}

		function makeEvent(t,eventType){
			for(var i in t){

					if(t[i][eventType] === null){
						// Here we create a function for onmousedown
						// -----------------------------------------
						t[i][eventType] = function(){
							onOff();
						}
					}else{
						// Here we 'add' to any already exhisting function for onmousedown
						// ---------------------------------------------------------------
						t[i][eventType] = (
							function(_super){
								return function(){
									onOff();
									return _super.apply(this,arguments);
								}
							}
						)(t[i][eventType])
					}
				}
		}

		// assigning functions to mouse event
		// ----------------------------------
		switch(type){
			case 'click':
				makeEvent(trigger,'onmousedown');
			break;

			case 'rollover':
				makeEvent(trigger,'onmouseover');
			break;
		}

		return this;
	};


	// ---------------------------------
	// PRIVATE CONSTRUCTORS & FUNCTIONS
	// ---------------------------------

	function Ziggle(jig,id,zig,preset,options,targetNode,delay){
		
		var q = new TimelineLite();

		q.data = options;
		q.data._reps = -1;
		q.data._self = q;
		q.data._parent = zig;
		q.data._height = parseInt( window.getComputedStyle(targetNode,null).getPropertyValue("height") );
		q.data._width = parseInt( window.getComputedStyle(targetNode,null).getPropertyValue("width") );
		q.data._boolean = false;

		var l = options._repeat+1;


		// -----------------------
		// Loops
		// -----------------------
		if(typeof preset === 'string'){
			for (var i = 0 ; i<l ; i++){
				var motion = getPreset(preset);
				var fragment = motion.animation(targetNode,options,delay);
				fragment.call(function(){
					jig.zigsArr[zig._id].ziggles[id].timeline._reps++
				})

				if(options._staggerWait){
					q.add(fragment,'-='+delay);
				}else{
					q.add(fragment);
				}

				q._name = zig._name+'_'+id+'_'+i;
				q._id = id;
				
			}

		}

		q._reps = 0;
						
		q.add(function(){
			//console.log('Ziggle Complete: '+this._prev._timeline._name);
		});

		return q;
	};

	function timelineData(child,additions){

		newObj = {
			options:child.data,
			time:child.time(),
			duration:child.totalDuration(),
			active:child._active,
			timeline:child,
			reps:0
		};

		newObj.loopProgress = function(){
				
		
			// Calculate Time in Ziggle fragment (loop)
			// ----------------------------------------
			var x = child.time();
			var y = child.totalDuration();
			var loops = child.data._repeat+1;
			var reps = child._reps;
			var z = child.data._speed;
			// ------

			var rr;

			if(reps === 0){
				rr = x;
			}else{
				var c = z*reps
				rr = x-c
				if(rr < .01){
					rr = 1;
				}
			};

			return rr;
		};

		if(additions instanceof Array){
			for(var i = 0 ; i<additions.length ; i++){
				newObj[i] = additions
			};
		}else if(additions instanceof Object){
			for(var i in additions){
				newObj[i] = additions[i]
			};
		}

		return newObj;
	};

	function handleArguments(args){

		// ------------------------------------------------------------------------------
		// sorts 3 arguments as :[string,number,object,boolean] and returns the new array
		// ------------------------------------------------------------------------------

		var newArgs = [];

		for(var i in args){
			if(typeof args[i] === 'string'){
				newArgs[0] = args[i];
			}

			if(typeof args[i] ==='number'){
				newArgs[1] = args[i];
			}

			if(typeof args[i] === 'object'){
				newArgs[2] = args[i];
			}

			if(typeof args[i] === 'boolean'){
				newArgs[3] = args[i];
			}

			if(typeof args[i] === 'function'){
				newArgs[4] = args[i];
			}

		}

		return newArgs;
	};

	function calcStagger(parent,i){
		var stagger;
		
		if(i === '0'){ 
			stagger = 0; 
		}else{ 
			stagger = parent.data._stagger*parseInt(i*1000)/1000; 
		}

		return stagger;
	};

	function getPreset(query){
		preset = library[query];
		return preset;
	};

	function filter(newData,defaultData){

		// Add an underscore to indicate this data is internal and local.
		// ---------------------------------------------------------------
		for(var i in newData){
			newData['_'+i] = newData[i]
			delete newData[i];
		};

		// Compare newData with defaultData
		// ----------------------------------
		for(var i in defaultData){
			if(newData[i] === undefined){
				newData[i] = defaultData[i];
			}
		};

		return newData;
	};

	function getNode(nodeString){

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

			function removeUndefined(x){

				var y = {};
				for(var i in x){
					if(x[i].nodeName !== undefined){
						y[i] = x[i]
					}
				}

				return y;
			}

			function searchForNode(parent,matchWith,deep){

				var r = 0;
				var matched = [];

				var l = Object.keys(removeUndefined(parent)).length

				for (var i in parent){
					
					if(parent[i].nodeName !== undefined){

						r++;
						var p = parent[i].nodeName.toLowerCase()
						
						if(p === matchWith){	

							matched.push(parent[i])

							if(r === l-1){
								if(matched.length>0){
									return matched;
								}else{
									return false;
								}
							}
							
						}else{
							if(parent[i].childNodes !== undefined){
								q = searchForNode(parent[i].childNodes,matchWith);
								if( q !== undefined){
									return q;
								}
							}
						}
					}
				}

			}

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

				var parent = removePrefix(splitN[0]);
				var child = removePrefix(splitN[1]);
				var parentsNodes = findNode(parent[0],parent[1])[0].childNodes;
				var result = searchForNode(parentsNodes,child[1]);

				console.log(result)

				if(result !== false && result !== undefined){
					thisNode = result;
				}else{
					console.log('No Node Found, please use an id for your parent element');
				}
				
			}


			// -------------------------------
			// RETURN
			// -------------------------------
			return thisNode;
	};

	var library = {

		hop:{
			options:{
				_speed:1, 
				_amplitude:1,
				_rotation:15,
				_density:.7,
				_scale:1,
				_origin:'50% 100%', // ground

				_repeat:0
			},
			animation:function(actor,o,d){

				var q = new TimelineLite();
				// Your custom setting modifications		
				var s=[o._speed/6,o._speed/4,o._speed/5];
				var f = 0;
				for(var i in s){ f += s[i]; };
				s[3] = o._speed%f;

						
				var amp = (o._amplitude*-1)*o._self.data._height;
				
				// ------------------------------------------------------------------------------
				// We want to make our actor rotate a bit in the air, but we want it to alternate
				// ------------------------------------------------------------------------------
				o._self._boolean = o._self._boolean ? false : true;
				var b = o._self._boolean ? o._rotation+'deg' : (-1*o._rotation)+'deg';

				// ----------------------------------------
				// Assign animation to q (timeline)
				// ----------------------------------------
				q.add(
					TweenLite.to(actor,s[0],{
						delay:d,
						scaleX:o._scale*1+(1-o._density),
						scaleY:o._scale*1-(1-o._density),
						transformOrigin:o._origin,
						ease:'easeIn'
					})
				);
						
				q.add(
					TweenLite.to(actor,s[1],{
						scaleX:o._scale*1-(.9-o._density),
						scaleY:o._scale*1+(.9-o._density),
						y:amp,
						transformOrigin:o._origin,
						ease:'linearOut',
						rotation:b
					})
				);

				q.add(
					TweenLite.to(actor,s[2],{
						scaleX:o._scale*.8+(1-o._density),
						scaleY:o._scale*1-(1-o._density),
						y:0,
						ease:'easeIn',
						rotation:0
					})
				);

				q.add(
					TweenLite.to(actor,s[3],{
						scaleX:o._scale,
						scaleY:o._scale,
						y:0,
						ease:'linearOut'
					})
				);

				return q;
			}
		}		
	};

})(document,window);