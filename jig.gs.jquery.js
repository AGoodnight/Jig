(function($,document){

	party=[],
		
	removeAll=function(){
		for( var g in this.party){
					
				this.party[g].timeline.pause();
		}
		party = [];
	},
	perElement = function(elems){
		var de = 0;
		for( var f in elems ){
			de+=.1
			wiggle(elems[f],{ speed:.5, delay:de });
		}
	},
		
		
	wiggle=function(elem,obj){
	
		var me = new animation(elem,obj);
		var sp = me.settings.speed/2;
		var le = parseInt(me.settings.width)/5;
		
		me.anim = function(j){
			me.timeline.to(elem,sp,{rotation:20,left:le,ease:'easeInOut'});
			me.timeline.to(elem,sp,{rotation:-20,left:-le,ease:'easeInOut'});
			if(j){ me.timeline.call(me.loop) }
		};
		
		me.init();
		party.push(me);

	}
	
	jump=function(elem,obj){
	
		var me = new animation(elem,obj);
		var sp = me.settings.speed/2;
		var am = me.settings.amount
		var hp =  parseInt(me.settings.height)*1.1+'px'
		
		me.anim = function(j){
			me.timeline.to(elem,sp,{height:hp, top:-am,ease:'easeOut'});
			me.timeline.to(elem,sp,{height:me.settings.height,top:0,ease:'easeIn'});
			if(j){ me.timeline.call(me.loop) }
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
			amount:10,
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