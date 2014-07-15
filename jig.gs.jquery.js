(function($,document){

	party=[],
		
	removeAll=function(){
		for( var g in this.party){
					
				this.party[g].timeline.pause();
		}
		party = [];
	},

	perElement = function(method,elems){
		var de = 0
		for( var f in elems ){
			de+=.1
			method(elems[f],{ speed:.5, delay:de });
		}
	},
		
		
	wiggle=function(elem,obj){
	
		var _me = new animation(elem,obj);
		var _tl = _me.timeline;
		
		var speed = _me.settings.speed; // Speed
		var amp = parseInt(_me.settings.amplitude); // Amplitude
		var wid = parseInt(_me.settings.width); // Width
		var hgt = parseInt(_me.settings.height); // Height
		var bol = _me.settings.bol
		
		_me.anim = function(j){
			
			var rand=function(num){
			  var n = Math.round(Math.random()*num);
			  if(n > num){
			    rand(num);
			  }else{
			    console.log('random = '+n);
			    return n;
			  }
			}
			
			inf = rand(2)+amp; //influence
			x = inf/rand(2)+amp;
			y = 1;// create an radius line
			s = speed/2;
			
			// vector 1
			_tl.to(elem,s,{
			  left:x*amp,
			  top:y*amp,
			  ease:'easeInOutCirc'
			});
			// vector 1
			_tl.to(elem,s,{
		    left:x*-amp,
			  top:y*-amp,
			  ease:'easeInOutCirc'
			});
			
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
		party.push(_me);

	}
	
	jump=function(elem,obj){
	
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
		party.push(_me);

	}
	

	function animation(e,o){
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
			bol:true
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
		
		obj.timeline = new TimelineLite({delay:obj.settings.delay});
		
		return obj;
	}
	

})($,document);