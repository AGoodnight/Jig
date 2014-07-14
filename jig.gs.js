(function(document){ 

	byId = function(e){
		return document.getElementById(e);
	}

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
		var me = new animation(obj);
		me.stats.reps = 0;
		
		var tl = new TimelineLite({delay:me.settings.delay});
		me.timeline = tl;
		
		var g = 
		me.loop = function(repeats){
		
			var sp = me.settings.speed/2;
			me.stats.reps++
		
			tl.to(elem,sp,{rotation:20,left:'30px',ease:'easeInOut'});
			tl.to(elem,sp,{rotation:-20,left:'-30px',ease:'easeInOut'});
			//tl.delay(me.settings.delay);
		
			// Support for setting repeat or infinite loop
			if(me.settings.repeats === null || me.stats.reps<me.settings.repeats){
				tl.call(g);
			}else{
				console.log('finished repeatitions');
				party = [];
			}
	
		}
		
		//console.log(me);
		me.init();
		party.push(me);

	}

	function animation(o){

		obj = {};
		obj.timeline = {};
		obj.settings = {
		
			speed:2,
			repeats:null,
			delay:0,
			
		};
		
		obj.stats ={
		};
		
		obj.init = function(){
			if(this.settings.repeat == null){
				this.loop();
			}else{
				this.loop(this.settings.repeat);
			}
		};
		
		// set settings based on obj
		for(var j in o){
			if(o[j] != undefined){
				obj.settings[j] = o[j]
			}
		};
		
		return obj;
	}
	
	

})(document);