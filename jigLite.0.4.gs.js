

function jig(){
	var q = new TimelineLite({paused:true});
	q.nodeStrings = [];
	q.nodes = [];
	q.data={};

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

TimelineLite.prototype.play = (
	function(_super){
		return function(){
			this.active = true;
			return _super.apply(this,arguments);
		}
	}
)(TimelineLite.prototype.play);

TimelineLite.prototype.zigInstance = function(preset,options){
	
	this.instances++
	var jig = this;
	var stagger;
	var zig = new TimelineLite();
	zig.data = filter(options,getPreset(preset).options);

	if(!!options._name){
		zig._name = options._name
	}else{
		zig._name = preset+'_'+this.zigsArr.length
	}

	var ziggleArr = {};
	for(var i in this.nodes){

		// -----------------------------------------------------------
		// Selecting classes and tags can result in groups of Ziggles
		// -----------------------------------------------------------
		if(this.nodes[i].length > 1){
			
			var ziggleGroup = new TimelineLite();

			for(var j in this.nodes[i]){
					
					// Calculate Stagger
					// ------------------
					if(j === '0'){ stagger = 0; }else{ stagger = zig.data._stagger*parseInt(j*1000)/1000; }
					
					// Create a Ziggle
					// ----------------
					var ziggle = new Ziggle(this,zig,preset,zig.data,this.nodes[i][j],stagger);
					ziggleArr[zig._name+'_'+this.nodeStrings[i]+'_'+preset+'_'+j] = timelineData(ziggle,{
						actor:this.nodes[i][j],
						delay:stagger
					});
					ziggle.add(function(){
						// this will execute after the ziggle has run
					})

					ziggleGroup.add(ziggle,stagger);
				}
			
			// Add ZiggleGroup to Zig
			// ------------------
			zig.add(ziggleGroup,0);

		// ------------------------------------------------
		// Selecting IDs results in one ziggle for that ID
		// ------------------------------------------------
		}else{
				
			// Calculate Stagger
			// ------------------
			if(i === '0'){ stagger = 0; }else{ stagger = zig.data._stagger*parseInt(i*1000)/1000; }
			
			// Create a Ziggle
			// ----------------
			var ziggle = new Ziggle(this,zig,preset,zig.data,this.nodes[i],stagger);
				
			ziggleArr[zig._name+'_'+this.nodeStrings[i]+'_'+preset+'_'+i] = timelineData(ziggle,{
				actor:this.nodes[i],
				delay:stagger
			});

			// Add Ziggle to Zig
			// ------------------
			zig.add(ziggle,stagger);
			
		}
	}

	// ------------------------------------
	// Assigning data objects to our Jig
	// ------------------------------------
	
	// We add to an object to hold our zigs, we use a dot syntax here
	// ----------------------------------------------------------------
	if(!!this.zigs[zig._name]){
		this.zigs[zig._name+'_'+ parseInt(this.instances-1)] = timelineData(zig,{ziggles:ziggleArr});
	}else{
		this.zigs[zig._name] = timelineData(zig,{ziggles:ziggleArr});
	}

	// We also make an array so it is easier to iterate over our zigs
	// ----------------------------------------------------------------
	this.zigsArr.push(
		timelineData(zig,{ziggles:ziggleArr})
	);

	// We add the zig to our jig
	// -------------------------
	this.add(zig);
	return this;
};

function Ziggle(jig,zig,preset,options,targetNode,delay){
	
	var q = new TimelineLite();
	q.data = options;
	q.data._reps = -1;
	var l = options._repeat+1;
	zig.ziggles = {};

	// -----------------------
	// Loops
	// -----------------------
	if(typeof preset === 'string'){
		for (var i = 0 ; i<l ; i++){
			var motion = getPreset(preset);
			var fragment = motion.animation(targetNode,options,delay);
			fragment.call(function(){
				//this will execute after the ziggle fragment has run
			});

			if(options._staggerWait){
				q.add(fragment,'-='+delay);
			}else{
				q.add(fragment);
			}

			q._name = 'ziggle_'+i;
			
		}

	}

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

	newObj.loopTime = function(){
			
	
		// Calculate Time in Ziggle fragment (loop)
		// ----------------------------------------
		var x = child.time();
		var y = child.totalDuration();
		var loops = child.data._repeat+1;
		var reps = child.data._reps;
		var z = child.data._speed;
		// ------

		var rr;

		if(reps === 0){
			rr = x;
		}else{
			var c = z*reps
			rr = c
		}

		console.log(rr)

	};


	for(var i in additions){
		newObj[i] = additions[i]
	};

	return newObj;
}

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
			
		}


		// -------------------------------
		// RETURN
		// -------------------------------
		return thisNode;
};

var library = {

	hop:{
		options:{
			_repeat:0,
			_speed:3
		},

		animation:function(actor,o,d){

			var q = new TimelineLite();

			q.add(
				TweenLite.to(actor,o._speed/2,{
					x:100,
					delay:d
				})
			);

			q.add(
				TweenLite.to(actor,o._speed/2,{
					x:0
				})
			);

			return q;

		}
	}
};