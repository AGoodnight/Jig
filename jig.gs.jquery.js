(function($,document){

	jig = {

		init:function(){
			jig.rootTimeline = new TimelineLite();
		},

		removeAll:function(){
			for(var g in this.party){ this.party[g].timeline.pause() }
			this.party = [];
		},

		perElement: function(method,elems,delay,paramaters){
			var de = 0
			for( var f in elems ){
				paramaters.delay = de;
				method(elems[f],paramaters);
				de+=delay;
			}
		},

		party:[],
		rootTimeline:{}

	};

	function animation(e,o,root){
		var obj = {};	
		obj.anim = null;
		
		// STORAGE
		// -----------------------------------------------------------
		obj.settings = {
			name:e,
			speed:1,
			repeat:null,
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
			endScale:1
		};		
		
		obj.stats ={
			reps:null
		};		
		
		// FUNCTIONS
		// -----------------------------------------------------------
		obj.swap=function(r){
		  if(r){
		    r = false;
		  }else{
		    r = true;
		  };
		};
		
		obj.loop = function(){
			
			obj.stats.reps++;
			
			var j;
			
			if(obj.settings.repeat === null || obj.stats.reps<obj.settings.repeat){
				j = true;
			}else{
				j = false;
			}
			
			obj.anim(j);
			
		};
		obj.init = function(){
			console.log(obj.settings.name+' is animating');
			this.loop();
		};
		
		// SETUP
		// -----------------------------------------------------------
		for(var j in o){
			if(o[j] != undefined){
				obj.settings[j] = o[j]
			}
		};

		vars = {
			speed:obj.settings.speed, // Speed
			amp:parseInt(obj.settings.amplitude), // Amplitude
			wid:parseInt(obj.settings.width), // Width
			hgt:parseInt(obj.settings.height), // Height
			sx:parseInt(obj.settings.startX), // Width
			sy:parseInt(obj.settings.startY), // Height
			ex:parseInt(obj.settings.endX), // Width
			ey:parseInt(obj.settings.endY), // Height
		}
		
		obj.timeline = (!!root)? root : ( new TimelineLite({delay:obj.settings.delay}) );//
		return obj;
	};
			
		
	wiggle=function(elem,obj,timeline){
	
		var _me = new animation(elem,obj);
		var _tl = _me.timeline;
		
		var speed = _me.settings.speed; // Speed
		var amp = parseInt(_me.settings.amplitude); // Amplitude
		var wid = parseInt(_me.settings.width); // Width
		var hgt = parseInt(_me.settings.height); // Height
		var bol = _me.settings.bol;
		
		_me.anim = function(j){
			
			var inf,r,x,y,s;
			var nums = [];
			s = speed/2;

			var rand=function(num){
			  var n = Math.round(Math.random()*num);
			  if(n > num){
			    rand(num);
			  }else{
			    return n;
			  }
			};
			var newNumbers = function(i){
				
				bol = (bol)? false:true;
				r = (bol)? -1:1;

				console.log(nums[i],bol);

				if(i === -1){
					inf = rand(amp);	
				}else{
					do{
						inf = rand(amp);
					}while(inf === nums[i][0]);

					do{
						x = (inf/rand(amp))*r;
					}while(x === nums[i][1]);

					do{
						y = (inf/rand(amp))*r;
					}while(y === nums[i][2]);
				}

				nums.push([inf,x,y]);

				_tl.to(elem,s,{
			 		left:x*amp,
			 		top:y*amp,
			  		ease:'easeInOut'
				});

				console.log(inf, nums);	
			};

			newNumbers(-1);
			newNumbers(0);
			newNumbers(1);
			newNumbers(2);
			newNumbers(3);
			newNumbers(4);
			newNumbers(5);
			
			//ANIMATION END
			//====================
			if(j){ _me.timeline.call(_me.loop) }else{
				_me.timeline.to(elem,s,{
					top:0,
					left:0
				});
			  console.log(_me.settings.name+' is at rest');
			}
			
		};
		
		_me.init();
		jig.party.push(_me);

	};
	
	jump=function(elem,obj,timeline){
	
		var _me = new animation(elem,obj);
		var _tl = _me.timeline;
		
		var speed = _me.settings.speed; // Speed
		var amp = parseInt(_me.settings.amplitude); // Amplitude
		var wid = parseInt(_me.settings.width); // Width
		var hgt = parseInt(_me.settings.height); // Height
		var bol = _me.settings.bol
		
		_me.anim = function(j){
			var w,h,a,o,s,e,b;
			
			// aloofness
			// --------------
			bol = bol ? false : true;
			b = bol ? '20deg' : '-20deg';
			
			// action
			// --------------
			
			//1 windup
			w=wid*1.1;
			h=hgt*.9;
			a=hgt*.1;
			o = wid*-.05;
			s = speed/12;
			e='easeIn';
			
			_tl.to(elem,s,{
				width:w+'px',
				height:h+'px',
				top:a+'px',
				left:o+'px',
				ease:e
			});
			
			//2 launch
			w = wid*.9;
			h = hgt*1.1;
			a = amp*-.6;
			o= wid*.05;
			s= speed/2;
			e='linearOut';
			lean = bol;
			
			_tl.to(elem,s,{
				width:w,
				height:h,
				top:a,
				left:o,
				ease:e,
				rotation:b
			});
			
			//4 fall
			w = wid*.9;
			h = hgt*1.1;
			a = hgt*-.2;
			o = wid*.05;
			s = speed/8;
			e='easeIn';
			
			_tl.to(elem,s,{
				width:w,
				height:h,
				top:a,
				left:o,
				ease:e,
				rotation:0
			});
			
			//6 rest
			w = wid;
			h = hgt;
			a = 0;
			o = 0;
			s=speed/9;
			e='linearOut';
			
			_tl.to(elem,s,{
				width:w,
				height:h,
				top:a,
				left:o,
				ease:e
			});
			
			//ANIMATION END
			//====================
			if(j){ _me.timeline.call(_me.loop) }else{
				_me.timeline.to(elem,s,{
					height:h,
					top:0,ease:'easeIn'
				});
			  console.log(_me.settings.name+' is at rest');
			}
		};
		
		_me.init();
		jig.party.push(_me);

	};

	plop=function(elem,obj,timeline){
	
		var _me = new animation(elem,obj);
		var _tl = _me.timeline;

		var speed = _me.settings.speed; // Speed
		var amp = parseInt(_me.settings.amplitude); // Amplitude
		var wid = parseInt(_me.settings.width); // Width
		var hgt = parseInt(_me.settings.height); // Height
		var sx = parseInt(_me.settings.startX); // Width
		var sy = parseInt(_me.settings.startY); // Height
		var ex = parseInt(_me.settings.endX); // Width
		var ey = parseInt(_me.settings.endY); // Height
		
		_me.anim = function(j){
			
			

			_tl.to(elem,0,{
			  left:sx,
			  top:-sy,
			  height:hgt,
			  width:wid,
			  ease:'linear'
			});

			//fall

			_tl.to(elem,speed/3,{
			  left:ex+(wid*.05),
			  top:ey-(hgt*.1),
			  height:hgt*1.1,
			  width:wid*.9,
			  ease:'linear'
			});

			//land
			
			_tl.to(elem,speed/6,{
			  left:ex-(wid*.05),
			  top:ey+(hgt*.1),
			  height:hgt*.9,
			  width:wid*1.1,
			  ease:'easeInCirc'
			});

			//rest

			_tl.to(elem,speed/4,{
			  left:ex,
			  top:ey,
			  height:hgt,
			  width:wid,
			  ease:'easeOutCirc'
			});

			//rebound
			
			_tl.to(elem,speed/5,{
			  left:ex-(wid*.025),
			  top:ey+(hgt*.05),
			  height:hgt*.95,
			  width:wid*1.05,
			  ease:'easeInOutCirc'
			});

			//rest

			_tl.to(elem,speed/3,{
			  left:ex,
			  top:ey,
			  height:hgt,
			  width:wid,
			  ease:'easeInOutCirc'
			});
			
			//ANIMATION END
			//====================
			if(j){ _me.timeline.call(_me.loop) }else{

			  console.log(_me.settings.name+' is at rest');
			}
		};
		
		_me.init();
		jig.party.push(_me);

	};

	zip=function(elem,obj,timeline){
	
		var _me = new animation(elem,obj);
		var _tl = _me.timeline;

		var speed = _me.settings.speed; // Speed
		var amp = parseInt(_me.settings.amplitude); // Amplitude
		var wid = parseInt(_me.settings.width); // Width
		var hgt = parseInt(_me.settings.height); // Height
		var sx = parseInt(_me.settings.startX); // Start X coordinate
		var sy = parseInt(_me.settings.startY); // Start Y coordinate
		var ex = parseInt(_me.settings.endX); // End X coordinate
		var ey = parseInt(_me.settings.endY); // End Y coordinate
		var ss = parseInt(_me.settings.startScale); // Start Scale
		var es = parseInt(_me.settings.endScale); // End Scale
		var rot = parseInt(_me.settings.rotation); //Rotations
		var e = parseInt(_me.settings.ease);//easing

		_me.anim = function(j){
			
			_tl.to(elem,0,{
			  left:sx,
			  top:-sy,
			  rotation:rot,
			  scale:ss,
			});

			//arrival
			_tl.to(elem,speed,{
			  left:ex+(wid*.05),
			  top:ey-(hgt*.1),
			  rotation:0,
			  scale:es,
			  ease:e
			});
			
			//ANIMATION END
			//====================
			if(j){ _me.timeline.call(_me.loop) }else{

			  console.log(_me.settings.name+' is at rest');
			}
		};
		
		_me.init();
		jig.party.push(_me);

	};

	jig.init();



})($,document);