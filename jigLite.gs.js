(function(document){
	
/*
1. ( 'parent, child' ) node selector
2. freeze and thaw
3. 
*/

	var jigs=[];
	jig = function(nodeString,settings,sync){

		var q = new extendedTimelineLite('jig',settings,sync);
		q.data.nodeString = nodeString;
		q.data.node = nodeSelector(nodeString);
		
		jigs.push(q);
		return q;
	};

	// How to use Jig
	/*
	jig('#myObject',{
		speed:1, startOpacity:0
		},{
		timeline:Jive, sync:1
		});
	*/
	extendedTimelineLite = function(type,settings,sync){
		var lite = new TimelineLite();
		lite.data = new jigNodes();
		lite.type = type;
		
		if(type === 'jig'){
			lite.data = jigNodes(settings);
			lite.instances = []; // keep track of how many times the DOM object is given a chain of constructors
			lite.defaultOverwrite = 'none';	
		}

		if(type === 'zig'){
			lite.data = zigNodes(settings);
		}

		if( typeof sync === 'string' || typeof sync === 'number' ){
			lite.data.sync = sync
		}

		return lite;
	};

	// Jig nodes are the data types needed to make the Jig object work
	jigNodes = function(set){
		
		nodes = {
				nodeType:'JIG',
				// Timeline setup
				name:'untitled',
				sync:0,
				timeline:undefined,

				// DOM Traversing
				nodeString:undefined, //Original selector value
				node:undefined, // DOM reference
				targetNode:undefined,

				//timing
				delay:0,
				stagger:0,
				speed:undefined,
				
				//repeat
				repeat:0,
				reps:[0],

				//state
				active:false
		};
		
		if(typeof set === 'string'){
		// behaves like a 'get' function
		// -----------------------------------
			console.log(this+' --- '+set)
		// -----------------------------------
		}
		if(typeof set === 'object'){
		// behaves like a 'set' function
		// -----------------------------------
			for(var j in set){
				if(nodes.hasOwnProperty(j+'')){
					nodes[j] = set[j];
					}
			}
			return nodes;
		// -----------------------------------
		}

		if(set === undefined){
			// behaves like a 'constructor' function
			// -----------------------------------
			return nodes;
			//-----------------------------------
		}
	};
	// Zig nodes are the data types needed to perform the actual animations in the jig object
	zigNodes = function(set){
		nodes = {
				nodeType:'ZIG',
				// Timeline setup
				name:'untitled',
				sync:0,
				timeline:undefined,
				preset:undefined,
				
				//relative
				amplitude:undefined,
				life:undefined,

				//timing
				delay:0,
				stagger:0,
				speed:undefined,

				//transform
				origin:'%50 %50',

				//scale
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

				//location
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

				//state
				active:false
		};
		
		if(typeof set === 'string'){
		// behaves like a 'get' function
		// -----------------------------------
			console.log(this+' --- '+set)
		// -----------------------------------
		}
		if(typeof set === 'object'){
		// behaves like a 'set' function
		// -----------------------------------
			for(var j in set){
				if(nodes.hasOwnProperty(j+'')){
					nodes[j] = set[j];
					}
			}
			return nodes;
		// -----------------------------------
		}

		if(set === undefined){
			// behaves like a 'constructor' function
			// -----------------------------------
			return nodes;
			//-----------------------------------
		}
	};

	nodeSelector = function(nodeString){

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
						arr[1] = o.substr(0);
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
		var splitN = n.split(' ')

		if(splitN.length < 2){
			// simple selection
		}else{
			// looking for node iinside a parent
			var parent = removePrefix(splitN[0]);
			var child = removePrefix(splitN[1]);

			var firstNode = findNode(parent[0],parent[1]);
			
			console.log('Elements ------')
			
			for(var i in firstNode){
				var nodes = firstNode[i].childNodes;

				for(var i in nodes){
					if(nodes[i].nodeType === 1){ // make sure the node is an 'Element'
						console.log(nodes[i]);
					}
				}

			}
		}
	};

	TimelineLite.prototype.auto = function(preset,settings,sync){	
		
		// this function is a prototyp eof the jig object
		var jig = this;

		var q = new extendedTimelineLite('zig',settings,sync);
		jig.sync(jig,q,1);
		
		return jig;	
	};

	TimelineLite.prototype.sync = function(jig,zig,sync){
	
		var s = parseInt(sync*1000)/1000;
		var td = jig.totalDuration();
		var g;

		if(td == s){
			g = td-s; //console.log('+='+g);
			jig.add(zig,'+='+g);
			//console.log('EQUAL TO --- '+jig.data.name+' --- '+zig.data.name+' --- '+jig.totalDuration());
		}else if(td>s){	
			g = td-s;//console.log('-='+g);
			jig.add(zig,'-='+g);
			//console.log('GREATER THAN --- '+jig.data.name+' --- '+zig.data.name+' --- '+jig.totalDuration());
		}else if(td<s){	
			g = sync-td; //console.log('+='+g);
			jig.add(zig,'+='+g);
			//console.log('LESS THAN --- '+jig.data.name+' --- '+zig.data.name+' --- '+jig.totalDuration());
		}
	};


})(document);