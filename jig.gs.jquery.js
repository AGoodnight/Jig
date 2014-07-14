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
	
		var me = new animation(elem,obj);
		var sp = me.settings.speed/2;
		var le = parseInt(me.settings.width)/5;
		
		me.anim = function(j){
			me.timeline.to(elem,sp,{rotation:20,left:le,ease:'easeInOut'});
			me.timeline.to(elem,sp,{rotation:-20,left:-le,ease:'easeInOut'});
			if(j){ me.timeline.call(me.loop) }else{
				me.timeline.to(elem,sp,{rotation:0,left:0,ease:'easeInOut'});
			}
		};
		
		me.init();
		party.push(me);

	}
	
	jump=function(elem,obj){
	
		var me = new animation(elem,obj);
		var speed = me.settings.speed; // Speed
		var amp = parseInt(me.settings.amplitude); // Amplitude
		var wid = parseInt(me.settings.width); // Width
		var hgt = parseInt(me.settings.height); // Height
		var off; //Offset
		var tl = me.timeline;
		
		me.anim = function(j){
			
			//1 windup
			w=wid*1.1;
			h=hgt*.9;
			a=hgt*.1;
			o = wid*-.05;
			s = speed/12;
			e='easeIn';
			
			tl.to(elem,s,{
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
			
			tl.to(elem,s,{
				width:w,
				height:h,
				top:a,
				left:o,
				ease:e
			});
			
			//4 fall
			w = wid*.9;
			h = hgt*1.1;
			a = hgt*-.2;
			o = wid*.05;
			s = speed/8;
			e='easeIn';
			
			tl.to(elem,s,{
				width:w,
				height:h,
				top:a,
				left:o,
				ease:e
			});
			
			//6 reset
			w = wid;
			h = hgt;
			a = 0;
			o = 0;
			s=speed/9;
			e='linearOut';
			
			tl.to(elem,s,{
				width:w,
				height:h,
				top:a,
				left:o,
				ease:e
			});
			
			//ANIMATION END
			//====================
			if(j){ me.timeline.call(me.loop) }else{
				me.timeline.to(elem,sp,{
					height:h,
					top:0,ease:'easeIn'
				});
			}
		};
		
		me.init();
		party.push(me);

	}
	

	function animation(e,o){
		var obj = {};	
		obj.anim = null;
		
		// STORAGE
		// -----------------------------------------------------------
		obj.settings = {
			name:e,
			speed:2,
			repeat:null,
			delay:0,
			amplitude:10,
			width: $(e).css('width'),
			height: $(e).css('height')
		};		
		
		obj.stats ={
			reps:null
		};		
		
		// FUNCTIONS
		// -----------------------------------------------------------
		obj.loop = function(){
			obj.stats.reps++
			var j;
			
			if(obj.settings.repeat === null || obj.stats.reps<obj.settings.repeat){
				j = true;
			}else{
				j = false;
			}
			
			obj.anim(j);
			
		};
		obj.init = function(){
		
			console.log('initialize');
			
			if(this.settings.repeat == null){
				this.loop();
			}else{
				this.loop()
			}
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