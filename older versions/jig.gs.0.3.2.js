/* This script is copyright Adam Goodnight 2014, all rights reserved
http://www.adamgoodnight.com
inquire@adamgoodnight.com

You may use this script anyway you wish, but do not remove this information.

Jig is a collection of preset presets

Jig is meant to be expanded upon and easy to use with Jquery and GSAP's timeline package.

Jig is still in alpha, and may not work in all browsers or under certain conditions, you may contribute 
to it's development or bring up any issues you experience with jig on github (http://github.com/AGoodnight/Jig).
*/

(function(document){

	party:[]; // a place for presets or 'jigs' to hang out after they have been instantiated

	plop=function(elem,vars,obj,timeline){
	
		var v = vars;
		var ex = v.exag/100

			timeline.to(elem,0,{
			  left:v.sx,
			  top:-v.sy,
			  scaleX:1,
			  scaleY:1,
			  transformOrigin:'50% 100%',
			  ease:'linear'
			});
			//fall
			timeline.to(elem,v.speed/3,{
			  top:v.ey,
			  scaleX:1-ex,
			  scaleY:1+ex,
			  ease:'linear'
			});
			//land
			timeline.to(elem,v.speed/6,{
			  top:0,
			  scaleX:1+ex,
			  scaleY:1-ex,
			  ease:'easeInCirc'
			});
			//rest
			timeline.to(elem,v.speed/4,{
			  top:0,
			  scaleX:1,
			  scaleY:1,
			  ease:'easeOutCirc'
			});
			//rebound
			timeline.to(elem,v.speed/5,{
			  scaleX:1-ex,
			  scaleY:1+ex,
			  ease:'easeInOutCirc'
			});
			//rest
			timeline.to(elem,v.speed/3,{
			  top:0,
			  scaleX:1,
			  scaleY:1,
			  ease:'easeInOutCirc'
			});

			timeline.call(obj.loop);
	};

})(document);

function jig(elem,model,parameters,root){

	if(elem instanceof Array){
		var obj = new jigParty(elem,model,parameters);
	}else{
		var obj = new jigAnimation(elem,model,parameters);
	}
	return obj;

}

function jigAnimation(element,type,o){

		var obj = {};	
		obj.anim = null;
		
		obj.settings = {
			speed:1,

			repeat:0,
			delay:0,
			
			amplitude:50,
			
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
			reps:0,
			playing:false,
			paused:false,
			complete:false
		};		
		
		// FUNCTIONS
		// -----------------------------------------------------------
		
		obj.pause = function(){
			obj.stats.paused = true;
			obj.stats.playing = false;
			obj.timeline.pause();
		}

		obj.play = function(reps){	
			if(obj.stats.playing === false){

				obj.stats.playing = true;
				obj.stats.paused = false;
				obj.stats.reps = 1;

				if(!!reps){
					if(reps !== 'forever'){
						obj.settings.repeat = reps;
					}else{
						obj.settings.repeat = -1;
					}
				}else{
					obj.settings.repeat = 1;
				}

				type(element,obj.vars,obj,obj.tl);	
			}
		};
		
		obj.loop = function(){
			if(obj.settings.repeat>-1){
				if(obj.stats.reps<obj.settings.repeat){
					obj.stats.reps++
					type(element,obj.vars,obj,obj.tl);	
				}else{
					obj.stats.complete = true;
					obj.stats.playing = false;
					obj.stats.pasued = false;
				}
			}else{
				type(element,obj.vars,obj,obj.tl);
			};
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
		obj.vars = {
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
			opaE:obj.settings.endOpacity // End Opacity
		};
		
		obj.tl = new TimelineLite({delay:obj.settings.delay});

		return obj;
};

function jigParty(element,type,o){

		var obj = {};	
		obj.anim = null;
		
		obj.settings = {
			speed:1,

			repeat:0,
			delay:0,
			
			amplitude:50,
			
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
			reps:0,
			playing:false,
			paused:false,
			complete:false
		};		
		
		// FUNCTIONS
		// -----------------------------------------------------------
		
		obj.pause = function(){
			obj.stats.paused = true;
			obj.stats.playing = false;
			obj.timeline.pause();
		}

		obj.play = function(reps){	
			if(obj.stats.playing === false){

				obj.stats.playing = true;
				obj.stats.paused = false;
				obj.stats.reps = 1;

				if(!!reps){
					if(reps !== 'forever'){
						obj.settings.repeat = reps;
					}else{
						obj.settings.repeat = -1;
					}
				}else{
					obj.settings.repeat = 1;
				}

				type(element,obj.vars,obj,obj.tl);	
			}
		};
		
		obj.loop = function(){
			if(obj.settings.repeat>-1){
				if(obj.stats.reps<obj.settings.repeat){
					obj.stats.reps++
					type(element,obj.vars,obj,obj.tl);	
				}else{
					obj.stats.complete = true;
					obj.stats.playing = false;
					obj.stats.pasued = false;
				}
			}else{
				type(element,obj.vars,obj,obj.tl);
			};
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
		obj.vars = {
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
			opaE:obj.settings.endOpacity // End Opacity
		};
		
		obj.tl = new TimelineLite({delay:obj.settings.delay});

		return obj;
};

var anim = new jig( 'myRegion', 'infoSlide', {
	
});