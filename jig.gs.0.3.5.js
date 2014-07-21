/* This script is copyright 2014 Adam Goodnight, All rights reserved.
http://www.adamgoodnight.com
inquire@adamgoodnight.com
You may use this script anyway you wish, but do not remove lines 1-26 of this script.

Jig is intened as an unoffical plugin for Greensock's Animation Platform (http://www.greensock.com/gsap-js/).

Jig is still in alpha, and may not work in all browsers or under certain conditions, you may contribute 
to it's development or bring up any issues you experience with jig on github (http://github.com/AGoodnight/Jig).

---------------------------------------
For version 0.3.6
---------------------------------------
testing....
1. Eradication of old jigs
2. The ability to pause animations using toggle();
3. support arrays ('className')

to do....
1. hover
2. jive
3. jiggle
4. shake
5. flutter
6. drag
7. BPM support
*/

(function(document){

	// lets you set a function as an object literal along with paramaters without running the function
	// -----------------------------------------------------------------------------------------------
	partial = function(func /*, 0..n args */) {
  		var args = Array.prototype.slice.call(arguments).splice(1);
  		return function() {
    		var allArguments = args.concat(Array.prototype.slice.call(arguments));
    		return func.apply(this, allArguments);
 	 	};
	}

	// Returns a random number as long as its not greater than the number passed to the function
	// -----------------------------------------------------------------------------------------
	rand=function(num){
		var n = Math.round(Math.random()*num);
		if(n > num){
			rand(num);
		}else{
			return n;
		}
	};

	// Returns a random number used to identify elements and presets, this is used to eliminate instance stacking
	// ----------------------------------------------------------------------------------------------------------
	randomSeed = function(){
		var j;
		var n = rand(100000);
		//console.log('New seed: '+n);

		if(party.length > 0){
			for (var g in party){
				
				if(party[g].settings.name instanceof Array){
					for(var i in party[g]){
						console.log(party[g][i].seed);
					}
				}else{
					j = document.getElementById(party[g].settings.name).getAttribute('partyid');
				}

				if(j===n){
					n = rand(100000);
				}else{
					return n;
				}

			}
		}else{
			return n;
		}
	};

	mixUp=function(arr){

			var currentIndex = arr.length
    		, temporaryValue
   			, randomIndex
    		;

  			// While there remain elements to shuffle...
  			while (0 !== currentIndex) {

	    		// Pick a remaining element...
	   			randomIndex = Math.floor(Math.random() * currentIndex);
	    		currentIndex -= 1;

	    		// And swap it with the current element.
	    		temporaryValue = arr[currentIndex];
	    		arr[currentIndex] = arr[randomIndex];
	    		arr[randomIndex] = temporaryValue;

  			}

  			return arr;
	};

	jigIndex = function(elem){
		var dom;


		//console.log('>>>>>>>>>>>>>>>>>>>>> jigindex()');
		//console.log('PARTY: '+party);
		//-------------------------------------------------------------
		// Determines if the dom element havs an attribute of 'partyid'
		if(elem instanceof Array){
			for(var i in elem){
				dom = document.getElementById(elem[i]).getAttribute('partyid');
			}
		}else{
			dom = document.getElementById(elem).getAttribute('partyid');
		};

		

		if(dom != null){
			var g=0;
			var j;
			//----------------------------------------------------
			/* loops through the party to try and find an instance 
			of the passed dom elements 'partyid' if it finds it, 
			it returns it's index.*/

			console.log(party.length);
			if(party.length>0){
				for(var i in party){
				
					j = party[g].settings.seed;
					//console.log('>> -- PARTY[OBJ]: '+j+' == DOM: '+dom);
					if(j == dom){
						return i;
						break;

					}else{
						g++;
					}
				}
				//----------------------------------------------------
				// if the instance of the jig is not found, return -1
				if(g === party.length){
					//console.log('- - - return: -1');
					return -1;
				};

			}else{
				// if the party is empty return -1
				//console.log('party is empty: '+party.length);
				return -1;
			};
				
		}else{

			//console.log('First Time');
			return -1;

		};
			
	};

	removeJig = function(obj){
		party = party.filter(
			function(item) { 
				if(item.settings.seed !== obj.settings.seed){
					//console.log(item.settings.seed+'=='+obj.settings.seed)
					return item; 
				}
		});
		//console.log('Party length after removal: '+party.length);
	};

	toggle = function(elem,model,parameters,spacing,random){

			//----------------------------------------------------
			// if the element has not been made a jig object yet
			//---------------------------------------------------
			if(jigIndex(elem) === -1){
				var instance = new preset(model,elem,parameters,spacing);
				instance.init();
				//console.log('-------new toggle--------');
			}else{
			//----------------------------------------
			// if the element is already a jig object
			//----------------------------------------
				var i = jigIndex(elem);
				//console.log('------toggling: '+i+'-------');

				if(party[i].stats.playing){
					party[i].pause();
				}else{
					party[i].play();
				}
				
			}
		
	};

	jig = function(elem,model,parameters,delay){
		//---------------------------------------------------
		// if the element has not been made a jig object yet
		//---------------------------------------------------

		if(jigIndex(elem) === -1){
			var instance = new preset(model,elem,parameters);
			instance.init();
		};
		
		//console.log('-------------------------------------------');

	};

	hover = function(elem,model,parameters,delay,random){
		// if your hovering over it it should watch to see when you leave and repeat the animation until that point.
	};

	var party = []; // a place for presets or 'jigs' to hang out after they have been instantiated

	//Instance Constructor
	function preset(model,element,o,delay){

		var obj = {};
		var tl,
			dl,
			vars,
			seed;

		obj.anim;
		obj.anims=[];
		
		obj.settings = {
			seed:0,
			name:element,
			
			speed:1,

			repeat:0,
			delay:0,
			
			amplitude:20,
			
			bol:true,
			
			startX:0,
			startY:0,
			endX:0,
			endY:0,
			
			startScale:1,
			endScale:1,
			
			aloofness:0,
			ease:'linear',
			exaggeration:0,
			
			startOpacity:1,
			endOpacity:1
		};		
		
		obj.stats ={
			reps:0,
			playing:false,
			paused:false,
			complete:false
		};		
		
		// FUNCTIONS
		// -----------------------------------------------------------
		
		obj.loop = function(index){

			if(index == undefined ){
				if(obj.settings.repeat === 'forever' || obj.stats.reps<obj.settings.repeat){ 
					obj.anim();	
				}else{
					obj.stats.complete = true;
					removeJig(obj);
				}
			}else{
				obj.anims[index]();
				//console.log('this featured is not yet supported - go to github https://github.com/AGoodnight/Jig')
			}	

			obj.stats.reps++;
		};

		obj.pause = function(){
			obj.stats.paused = true;
			obj.stats.playing = false;
			obj.timeline.pause();
			//Pause Effect
			//TweenLite.to(document.getElementById(obj.settings.name),.2,{opacity:.5})
		};

		obj.play = function(){
			obj.stats.paused = false;
			obj.stats.playing = true;
			obj.timeline.play();
			// Pause Effect
			//TweenLite.to(document.getElementById(obj.settings.name),.2,{opacity:1})
		};

		obj.init = function(){
			
			if(obj.stats.playing === false){

				obj.stats.playing = true;
				obj.stats.paused = false;
				obj.stats.reps = 0;

				if(obj.settings.repeat === 0){	
					// if it has no repeat set by user or a repeat of 0;
					if(obj.anims.length < 1){
						obj.anim();
					}else{
						for(var i in obj.anims){
							obj.anims[i]();

						}
					}

				}else{
					// if it loops or repeats
					if(obj.anims.length > 0){
						for(var i in obj.anims){
							obj.loop(i);
						}
					}else{
						obj.loop();
					}
				}
			}
		};

		
		// Assign passed parameters to obj.settings
		// -----------------------------------------------------------
		for(var j in o){
			if(o[j] != undefined){

				var u;

				if(j=='speed'){
					u = o[j];
					j = 'speed';
				}else if(j=='bpm'){
					var secs = 60/o[j]
					u = secs*1.2
					j = 'speed';
				}else{
					u = o[j];
				}

				obj.settings[j] = u;
			}
		};

		// Assign aliases for object literals in obj.settings
		// It looks really heavy here, but this makes the equations under each instance model much easier to read.
		// ----------------------------------------------------------------------------------------------------------
		vars = {
			speed:obj.settings.speed, // Speed
			amp:parseInt(obj.settings.amplitude), // Amplitude
			sx:parseInt(obj.settings.startX), // Starting Point [X]
			sy:parseInt(obj.settings.startY), // Starting Point [Y]
			ex:parseInt(obj.settings.endX), // Starting Point [X]
			ey:parseInt(obj.settings.endY), // Starting Point [Y]
			aloof:parseInt(obj.settings.aloofness), // Alloofness
			exag:parseInt(obj.settings.exaggeration), // Exaggeration
			rot:parseInt(obj.settings.rotation), //Rotation
			ss:obj.settings.startScale, // Start Scale
			es:obj.settings.endScale, // End Scale
			opaS:obj.settings.startOpacity, // Start Opacity
			opaE:obj.settings.endOpacity, // End Opacity
			ease:obj.settings.ease, // Ease
			bol:obj.settings.bol//boolean
		};


		// this creates the primary timeline (obj.timeline) for the preset
		// ---------------------------------------------------
		obj.timeline = new TimelineLite({delay:obj.settings.delay});

		if(element instanceof Array){
			obj.anims = [];
			for(var i in element){
				// Make a timeline for each item in the array and append it to the primary timeline
				// ---------------------------------------------------------------------------------
				tl = new TimelineLite();
				dl = delay*i;
				obj.timeline.append(tl,dl);
				// assign to anims for easy reference
				// ----------------------------------
				obj.anims[i] = partial(model,obj,element[i],vars,tl,dl,i);
			};
		}else{
			// Handle a single item
			// --------------------
			dl = 0;
			obj.anim = partial(model,obj,element,vars,obj.timeline,dl);
		}

		// Assigns the seed to DOM elements and obj.settings
		// -------------------------------------------------
		obj.settings.seed = randomSeed();

		if(element instanceof Array){
			for(var i in element){
				document.getElementById(
					document.getElementById(element[i]).getAttribute('id')
					).setAttribute('partyid',obj.settings.seed);
			}
		}else{
			document.getElementById(obj.settings.name).setAttribute('partyid',obj.settings.seed);
		}

		// Push this preset object to the party array
		// ------------------------------------------
		party.push(obj);
		console.log(party);
		return obj;

	};
			
	//Instance Models
	wiggle=function(obj,elem,vars,timeline,delay2,index){
	
		var v = vars;
		var tl = timeline;
		var dl;
		//console.log(tl);

		s = v.speed/5;

		tl.to(elem,s,{
			left:v.amp*-1,
			rotation:v.rot*-1,
			ease:v.e,
			delay:dl
		});

		tl.to(elem,s,{
			left:v.amp,
			rotation:v.rot,
			ease:v.e
		});

		tl.to(elem,s,{
			left:v.amp/2*-1,
			rotation:v.rot/2*-1,
			ease:v.e
		});

		tl.to(elem,s,{
			left:v.amp/2,
			rotation:v.rot/2*1,
			ease:v.e
		});

		tl.to(elem,s,{
			left:0,
			rotation:0,
			ease:v.e
		});

		tl.call(obj.loop,[index]);

	};
	
	jump=function(obj,elem,vars,timeline,delay2,index){

				
		var v = vars;
		var tl = obj.timeline;
		// PARAM: aloofness
		v.bol = v.bol ? false : true;
		b = v.bol ? v.aloof+'deg' : (-1*v.aloof)+'deg';

		// PARAM: exaggeration
		var ex = (1*v.exag)/100;
				
		// MAIN SEQUENCE
		// --------------
		//1 windup
		tl.to(elem,v.speed/6,{
			scaleX:(1+ex),
			scaleY:(1-ex),
			top:0,
			ease:'easeIn',
			transformOrigin:'50% 100%'
		});
				
		//2 launch
		tl.to(elem,v.speed/2,{
			scaleX:(1-ex),
			scaleY:(1+ex),
			top:v.amp*-1,
			ease:'easeOut',
			rotation:b
		});
				
		//4 fall			
		tl.to(elem,v.speed/4,{
			scaleX:(1-ex),
			scaleY:(1+ex),
			top:0,
			ease:'easeIn',
			rotation:0
		});
				
		//6 rest
		tl.to(elem,v.speed/8,{
			scaleX:1,
			scaleY:1,
			top:0,
			ease:'linear'
		});

		tl.call(obj.loop,[index])

	};

	/*plop=function(elem,obj){
	
		var _me = new preset(elem,obj);
		var _tl = _me.timeline;
		
		_me.anim = function(vars){
			
			var v = vars;
			var ex = v.exag/100

			_tl.to(elem,0,{
			  left:v.sx,
			  top:-v.sy,
			  scaleX:1,
			  scaleY:1,
			  transformOrigin:'50% 100%',
			  ease:'linear'
			});

			//fall

			_tl.to(elem,v.speed/3,{
			  top:v.ey,
			  scaleX:1-ex,
			  scaleY:1+ex,
			  ease:'linear'
			});

			//land
			
			_tl.to(elem,v.speed/6,{
			  top:0,
			  scaleX:1+ex,
			  scaleY:1-ex,
			  ease:'easeInCirc'
			});

			//rest

			_tl.to(elem,v.speed/4,{
			  top:0,
			  scaleX:1,
			  scaleY:1,
			  ease:'easeOutCirc'
			});

			//rebound
			
			_tl.to(elem,v.speed/5,{
			  scaleX:1-ex,
			  scaleY:1+ex,
			  ease:'easeInOutCirc'
			});

			//rest

			_tl.to(elem,v.speed/3,{
			  top:0,
			  scaleX:1,
			  scaleY:1,
			  ease:'easeInOutCirc'
			});

			_tl.call(_me.loop);
		};
		
		_me.init();
	};

	fly={};

	fly.from = function(elem,obj){
	
		var _me = new preset(elem,obj);
		var _tl = _me.timeline;

		_me.anim = function(vars){
			
			var v = vars;

			_tl.to(elem,0,{
			  left:v.sx,
			  top:-v.sy,
			  rotation:v.rot,
			  scale:v.ss,
			  opacity:v.opaS
			});
			console.log(v.ss);
			//arrival
			_tl.to(elem,v.speed,{
			  left:v.ex,
			  top:v.ey,
			  rotation:0,
			  scale:v.es,
			  ease:v.e,
			  opacity:v.opaE
			});

			_tl.call(_me.loop);

		};

		_me.init();
	};

	pulse=function(elem,obj){

		var _me = new preset(elem,obj);
		var _tl = _me.timeline;

		_me.anim = function(vars){

			var v = vars;

			_tl.to(elem,v.speed/2,{
				scale:v.es,
				rotation:v.rot
			});

			_tl.to(elem,v.speed/2,{
				scale:v.ss,
				rotation:0
			});

			_tl.call(_me.loop);
		};

		_me.init();
	
	};

	spin=function(elem,obj){

		var _me = new preset(elem,obj);
		var _tl = _me.timeline;

		_me.anim = function(vars){
			var v = vars;
			_tl.to(elem,v.speed,{
				ease:v.ease,
				rotation:'+='+v.rot
			})
			_tl.call(_me.loop);
		}

		_me.init();

	};

	sideStep = function(elem,obj){
	
		var _me = new preset(elem,obj);
		var _tl = _me.timeline;

		_me.anim = function(vars){
			var v = vars;	

			_tl.to(elem,.2,{
				scaleX:1.1,
				scaleY:.9,
				transformOrigin:'50% 100%',
				ease:'easeInExpo'
			});

			_tl.to(elem,.4,{
				scaleX:.9,
				scaleY:1.1,
				rotation:-20,
				bottom:50
		
			});

			_tl.to(elem,.2,{
				scaleX:1.1,
				scaleY:.9,
				bottom:0,
				rotation:0,
				transformOrigin:'50% 100%',
				ease:'easeInExpo'
			});

			_tl.to(elem,.4,{
				scaleX:.9,
				scaleY:1.1,
				rotation:20,
				bottom:50
			});

			_tl.to(elem,.2,{
				scaleX:1,
				scaleY:1,
				bottom:0,
				rotation:0,
				transformOrigin:'50% 100%',
				ease:'easeInExpo'
			});


			_tl.call(_me.loop);
		};

		_me.init();
	};*/


})(document);