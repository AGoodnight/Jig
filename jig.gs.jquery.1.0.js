/* This script is copyright Adam Goodnight 2014, all rights reserved
http://www.adamgoodnight.com
inquire@adamgoodnight.com

You may use this script anyway you wish, but do not remove this information.

Jig is a collection of animation presets

Jig is meant to be expanded upon and easy to use with Jquery and GSAP's timeline package.

Jig is still in alpha, and may not work in all browsers or under certain conditions, you may contribute 
to it's development or bring up any issues you experience with jig on github (http://github.com/AGoodnight/Jig).
*/

(function($,document){

	jig = {
		version:0.2,
			
		init:function(){
			jig.rootTimeline = new TimelineLite();
		},

		removeAll:function(){
			for(var g in this.party){ this.party[g].timeline.pause() }
			this.party = [];
		},

		mixUp:function(arr){
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
		},

		perElement: function(method,elems,delay,paramaters,randomize){
			var de = 0
			var arr;

			if(!randomize){
				arr = elems
			}else{
				arr = jig.mixUp(elems);
			}

			for( var f in arr ){
				paramaters.delay = de;
				method(elems[f],paramaters);
				console.log('F :'+f);
				de+=delay;
			}			
		},

		party:[], // a place for animations or 'jigs' to hang out after they have been instantiated
		rootTimeline: new TimelineLite() // a global timeline object

	};

	//Instance Constructor
	function animation(e,o,root){
		var obj = {};	
		obj.anim = null;
		
		// STORAGE
		// -----------------------------------------------------------
		obj.settings = {
			name:e,
			speed:1,
			repeat:0,
			delay:0,
			amplitude:50,
			width: $(e).css('width'),
			height: $(e).css('height'),
			bol:true,
			startX:0,
			startY:0,
			endX:0,
			endY:0,
			startScale:1,
			endScale:1,
			aloofness:20,
			exaggeration:0,
			startOpacity:1,
			endOpacity:1
		};		
		
		obj.stats ={
			reps:0
		};		
		
		// FUNCTIONS
		// -----------------------------------------------------------
		
		obj.loop = function(){

			if(obj.settings.repeat === 'forever' || obj.stats.reps<obj.settings.repeat){ 
				console.log('-REPEATING- '+obj.stats.reps+' < '+obj.settings.repeat)
				obj.anim(obj.vars);	
			}else{
				console.log('-completed loop-')
			}	

			obj.stats.reps++;
		};

		obj.init = function(){
			console.log(obj.settings.name+' is animating');
			
			if(obj.settings.repeat === 'forever'){
				this.loop();
			}else if(obj.settings.repeat > 1){
				this.loop();
			}else if(obj.settings.repeat === 0){
				obj.anim(obj.vars);	
			}

		};
		
		// SETUP
		// -----------------------------------------------------------
		for(var j in o){
			if(o[j] != undefined){
				obj.settings[j] = o[j]
			}
		};

		obj.vars = {
			speed:obj.settings.speed, // Speed
			amp:parseInt(obj.settings.amplitude), // Amplitude
			wid:parseInt(obj.settings.width), // Width
			hgt:parseInt(obj.settings.height), // Height
			sx:parseInt(obj.settings.startX), // Width
			sy:parseInt(obj.settings.startY), // Height
			ex:parseInt(obj.settings.endX), // Width
			ey:parseInt(obj.settings.endY), // Height
			aloof:parseInt(obj.settings.aloofness), // Alloofness
			exag:parseInt(obj.settings.exaggeration), // Exaggeration
			rot:parseInt(obj.settings.rotation), //Rotations
			ss:obj.settings.startScale, // Start Scale
			es:obj.settings.endScale, // end Scale
			opaS:obj.settings.startOpacity, // Start Scale
			opaE:obj.settings.endOpacity // end Scale
		};
		
		obj.timeline = (!!root)? root : ( new TimelineLite({delay:obj.settings.delay}) );// so you can append the motion to a timeline already in use.
		return obj;
	};
			
	//Instance Models
	wiggle=function(elem,obj,timeline){
	
		var _me = new animation(elem,obj);
		var _tl = _me.timeline;
		
		_me.anim = function(vars){
			
			var v = vars;

			var inf,r,x,y,s;
			var nums = [];
			s = v.speed/6;

			var rand=function(num){
			  var n = Math.round(Math.random()*num);
			  if(n > num){
			    rand(num);
			  }else{
			    return n;
			  }
			};

			var newVector = function(i){
				
				v.bol = (v.bol)? false:true;
				r = (v.bol)? -1:1;

				if(i === -1){
					inf = rand(v.amp);	
				}else{
					do{
						inf = rand(v.amp);
					}while(inf === nums[i][0]);

					do{
						x = (inf/rand(v.amp))*r;
					}while(x === nums[i][1]);

					do{
						y = (inf/rand(v.amp))*r;
					}while(y === nums[i][2]);
				}

				nums.push([inf,x,y]);

				console.log(x)
				_tl.to(elem,s,{
			 		left:x*v.amp,
			 		top:y*v.amp,
			  		ease:'easeInOut'
				});
			};

			newVector(-1);
			newVector(0);
			newVector(1);
			newVector(2);
			newVector(3);
			newVector(4);
			newVector(5);

			_tl.call(_me.loop);

		};
		
		_me.init();
		jig.party.push(_me);

	};
	
	jump=function(elem,obj,timeline){
	
		var _me = new animation(elem,obj);
		var _tl = _me.timeline;
		
		_me.anim = function(vars){
			
			var v = vars;
			
			// PARAM: aloofness
			v.bol = v.bol ? false : true;
			b = v.bol ? v.aloof+'deg' : (-1*v.aloof)+'deg';

			// PARAM: exaggeration
			var ex = (1*v.exag)/100;
			console.log(1+ex);
			
			// MAIN SEQUENCE
			// --------------
			//1 windup
			_tl.to(elem,v.speed/12,{
				width:v.wid*(1+ex),
				height:v.hgt*(1-ex),
				top:v.hgt*ex,
				left:v.wid*-(ex/2),
				ease:'easeIn'
			});
			
			//2 launch
			_tl.to(elem,v.speed/2,{
				width:v.wid*(1-ex),
				height:v.hgt*(1+ex),
				top:v.amp*-1,
				left:v.wid*(ex/2),
				ease:'linearOut',
				rotation:b
			});
			
			//4 fall			
			_tl.to(elem,v.speed/8,{
				width:v.wid*(1-ex),
				height:v.hgt*(1+ex),
				top:v.hgt*-(ex*2),
				left:v.wid*(ex/2),
				ease:'easeIn',
				rotation:0
			});
			
			//6 rest
			_tl.to(elem,v.speed/9,{
				width:v.wid,
				height:v.hgt,
				top:0,
				left:0,
				ease:'linearOut'
			});

			_tl.call(_me.loop)
		};
		
		_me.init();
		jig.party.push(_me);

	};

	plop=function(elem,obj,timeline){
	
		var _me = new animation(elem,obj);
		var _tl = _me.timeline;
		
		_me.anim = function(vars){
			
			var v = vars;

			_tl.to(elem,0,{
			  left:v.sx,
			  top:-v.sy,
			  height:v.hgt,
			  width:v.wid,
			  ease:'linear'
			});

			//fall

			_tl.to(elem,v.speed/3,{
			  left:v.ex+(v.wid*.05),
			  top:v.ey-(v.hgt*.1),
			  height:v.hgt*1.1,
			  width:v.wid*.9,
			  ease:'linear'
			});

			//land
			
			_tl.to(elem,v.speed/6,{
			  left:v.ex-(v.wid*.05),
			  top:v.ey+(v.hgt*.1),
			  height:v.hgt*.9,
			  width:v.wid*1.1,
			  ease:'easeInCirc'
			});

			//rest

			_tl.to(elem,v.speed/4,{
			  left:v.ex,
			  top:v.ey,
			  height:v.hgt,
			  width:v.wid,
			  ease:'easeOutCirc'
			});

			//rebound
			
			_tl.to(elem,v.speed/5,{
			  left:v.ex-(v.wid*.025),
			  top:v.ey+(v.hgt*.05),
			  height:v.hgt*.95,
			  width:v.wid*1.05,
			  ease:'easeInOutCirc'
			});

			//rest

			_tl.to(elem,v.speed/3,{
			  left:v.ex,
			  top:v.ey,
			  height:v.hgt,
			  width:v.wid,
			  ease:'easeInOutCirc'
			});

			_tl.call(_me.loop);
		};
		
		_me.init();
		jig.party.push(_me);

	};

	fly=function(elem,obj,timeline){
	
		var _me = new animation(elem,obj);
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
		jig.party.push(_me);

	};

	pulse=function(elem,obj,timeline){

		var _me = new animation(elem,obj);
		var _tl = _me.timeline;

		_me.anim = function(vars){

			var v = vars;

			console.log(-v.wid/2);

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
		jig.party.push(_me);
	
	};

	jiggle=function(elem,obj,timeline){};

	flutter=function(elem,obj,timeline){};

	
	jig.init();

})($,document);