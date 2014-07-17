/* This script is copyright Adam Goodnight 2014, all rights reserved
http://www.adamgoodnight.com
inquire@adamgoodnight.com

You may use this script anyway you wish, but do not remove this information.

Jig is a collection of preset presets

Jig is meant to be expanded upon and easy to use with Jquery and GSAP's timeline package.

Jig is still in alpha, and may not work in all browsers or under certain conditions, you may contribute 
to it's development or bring up any issues you experience with jig on github (http://github.com/AGoodnight/Jig).

---------------------------------------
For version 0.3.5
---------------------------------------
testing....
1. eradication of old jigs

to do....
1. The ability to pause animations using toggle();
	- Error occurs when pausing after another jig has started playing
2. hover
2. jive
4. jiggle
5. shake
6. flutter
7. drag


*/

(function(document){

	partial = function(func /*, 0..n args */) {
  		var args = Array.prototype.slice.call(arguments).splice(1);
  		return function() {
    		var allArguments = args.concat(Array.prototype.slice.call(arguments));
    		return func.apply(this, allArguments);
 	 	};
	}

	rand=function(num){
		var n = Math.round(Math.random()*num);
		if(n > num){
			rand(num);
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
		var g=0;

		for(var i in party){
			console.log(party[i].settings.name+' === '+elem)
			if(party[i].settings.name === elem){
				return i;
			}else{
				g++
			}
		}

		if(g === party.length){
			return -1;
		}
	}

	removeJig = function(index){
		console.log(">----Jig: "+party[index-1].settings.name+" removed----<");
		party = party.slice(index);
	};

	toggle = function(elem,model,parameters,delay,random){
		//----------------------------------------------------
		 // if the element has not been made a jig object yet
		 //---------------------------------------------------
		if(jigIndex(elem) === -1){
			parameters.partyPos = party.length;
			var instance = new preset(model,elem,parameters);
			if(elem instanceof Array){
				// handle multiple animations and a delay

					/*var de = 0
					var arr;

					if(!randomize){
						arr = elems
					}else{
						arr = mixUp(Array.prototype.slice.call(elems));
					}

					for( var f in arr ){
						paramaters.delay = de;
						method(arr[f],paramaters);
						de+=delay;
					}*/	

			}else{
				party.push(instance);
				instance.init();
			}
		}else{
		//----------------------------------------
		// if the element is already a jig object
		//----------------------------------------
			if(elem instanceof Array){
				// handle multiple animations and a delay
			}else{
				var i = jigIndex(elem);
				if(party[i].stats.playing){
					party[i].pause();
				}else{
					party[i].play();
				}
			}
		}
	};

	jig = function(elem,model,parameters,delay,random){
		//---------------------------------------------------
		// if the element has not been made a jig object yet
		//---------------------------------------------------
		if(jigIndex(elem) === -1){
			parameters.partyPos = party.length;
			var instance = new preset(model,elem,parameters);
			if(elem instanceof Array){
				// handle multiple elements and a delay
			}else{
				party.push(instance);
				instance.init();
			}
		}
	};

	hover = function(elem,model,parameters,delay,random){
		// if your hovering over it it should watch to see when you leave and repeat the animation until that point.
	};

	var party = []; // a place for presets or 'jigs' to hang out after they have been instantiated

	//Instance Constructor
	function preset(model,element,o){

		var obj = {};	
		obj.anim;
		
		obj.settings = {
			partyPos:0,
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
		
		obj.loop = function(){

			if(obj.settings.repeat === 'forever' || obj.stats.reps<obj.settings.repeat){ 
				obj.anim();	
			}else{
				obj.stats.complete = true;
				removeJig(obj.settings.partyPos+1);
			}	

			obj.stats.reps++;
		};

		obj.pause = function(){
			obj.stats.paused = true;
			obj.stats.playing = false;
			obj.timeline.pause();
			//Pause Effect
			TweenLite.to(document.getElementById(obj.settings.name),.2,{opacity:.5})
		};

		obj.play = function(){
			obj.stats.paused = false;
			obj.stats.playing = true;
			obj.timeline.play();
			// Pause Effect
			TweenLite.to(document.getElementById(obj.settings.name),.2,{opacity:1})
		};

		obj.init = function(){
			
			if(obj.stats.playing === false){

				obj.stats.playing = true;
				obj.stats.paused = false;
				obj.stats.reps = 0;

				if(obj.settings.repeat === 'forever'){
					this.loop();
				}else if(obj.settings.repeat > 1){
					this.loop();
				}else if(obj.settings.repeat === 0){
					obj.anim();	
				}
			}

		};


		
		// SETUP
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

		// It looks really heavy here, but this makes the equations under each instance model much easier to manage.
		var vars = {
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
		
		obj.timeline = new TimelineLite({delay:obj.settings.delay});
		
		if(element instanceof Array){
			obj.anims = [];
			for(var i in element){
				obj.anims[i] = partial(model,obj,element,vars);
			};
		}else{
			obj.anim = partial(model,obj,element,vars);
		}

		return obj;

	};
			
	//Instance Models
	wiggle=function(obj,elem,vars){
	
		var v = vars;
		var tl = obj.timeline;

		s = v.speed/5;

		tl.to(elem,s,{
			left:v.amp*-1,
			rotation:v.rot*-1,
			ease:v.e
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

		tl.call(obj.loop);

	};
	
	jump=function(obj,elem,vars){

				
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

		tl.call(obj.loop)

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