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
4. killJig - support arrays - 2823

to do....
1. Global Timeline - set css
2. jive
3. jiggle
4. shake
5. flutter
6. sonar
7. BPM support
*/

(function(document){

	// Global Timeline
	// ---------------
	gl = new TimelineLite();
	party = []; // a place for presets or 'jigs' to hang out after they have been instantiated

	assignToGlobal = function(ji,append,exceptions){
		
		var indexes=[];
		var jig = ji;
		if(jig instanceof Array){

			for(var i in jig){

				console.log(jig[i].settings.name);

				for(var j in exceptions){
					if(jig[i].settings.name === exceptions[j]){
						jig.splice(i);
						console.log('new jig: '+jig)
					}
				}
			};
			for(var i in jig){
				if(!append){
					gl.add(jig[i].timeline,'-='+gl.duration());
				}else{
					gl.add(jig[i].timeline);
				}
			};

		}else{
			if(!append){
				gl.add(jig.timeline,'-='+gl.duration());
			}else{
				gl.add(jig.timeline);
			}
		}
	};

	// lets you set a function as an object literal along with paramaters without running the function
	// -----------------------------------------------------------------------------------------------
	partial = function(func /*, 0..n args */) {
  		var args = Array.prototype.slice.call(arguments).splice(1);
  		return function() {
    		var allArguments = args.concat(Array.prototype.slice.call(arguments));
    		return func.apply(this, allArguments);
 	 	};
	};

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

	// Mixes up any array you give it
	// -------------------------------
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
	    		console.log(arr[currentIndex])

  			}
  			
  			return arr;
	};

	// Removes the prefix from your selector
	// -------------------------------------
	getName=function(selector){
		var name;
		var selection;

		if(selector instanceof Array || selector instanceof Object){
			selection = [];
			for(var i in selector){
				selection.push(selector[i].substr(1))
			}
			name = selection;
		}else{
			switch(selector[0]){

				case '.':
					selection = selector.substr(1);
					name = document.getElementsByClassName(selection);
					name = name[0].className;
				break;

				case '#':
					selection = selector.substr(1);
					name = document.getElementById(selection);
					name = name.id
				break;

				default:
					name = Array.prototype.slice.call(document.getElementsByTagName(selector));
					name = name[0].tagName
				break;
			}
		}

		return name;
	};

	// Returns the jig object associated with the selector queue
	// ---------------------------------------------------------
	getJig = function(selector){
		var g = 0;
		for(var i in party){
			if(String(party[i].settings.name).toLowerCase() == selector){
				g++;
			}
			if(String(party[i].settings.name).toUpperCase() == selector){
				g++;
			}
			if(String(party[i].settings.name) == selector){
				g++;
			}
			if(g<3){
				return party[i];
			}
		}
	};

	// Returns the DOM object associated with your selector queue
	// ----------------------------------------------------------
	getDom=function(selector){
		if(selector instanceof Array || selector instanceof Object){
			arr = selector;
		}else{
			var arr = [];
			var htmlObject;
			var func;

			switch(selector[0]){
				case '.':
					selection = selector.substr(1);
					htmlObject = Array.prototype.slice.call(document.getElementsByClassName(selection));
					for(var i in htmlObject){
						arr.push(htmlObject[i]);
					}
				break;
				case '#':
					selection = selector.substr(1);
					////console.log(selection);
					htmlObject = document.getElementById(selection);
					arr = [htmlObject];
				break;
				default:
					selection = selector;
					htmlObject = Array.prototype.slice.call(document.getElementsByTagName(selection));
					for(var i in htmlObject){
						arr.push(htmlObject[i]);
					}
				break;
			}

			
		}

		//console.log(arr);
		return arr;
	};

	// Used to detect instance stacking
	// --------------------------------
	jigIndex = function(name,domObj){
		////console.log(name,domObj);
		var g=0;
		//-------------------------------------------------------------
		// Determines if the dom name havs an attribute of 'partyid'
		if(party.length>0){
			for(var i in party){
				if(party[i].settings.name == name){
					console.log(name+' exists in party');
					return i
					break;
				}else{
					g++
				}

				if(g === party.length){
					return -1;
				}
			}
		}else{	
			console.log('party is empty');
			return -1;
		}	
	};

	// Sets the DOM elements paramters back to default and calls removeJig()
	//----------------------------------------------------------------------
	killJig = function(elem){

		// we make a clone so that removeJig can run without being affected
		var arr = party;
		var seed = document.getElementById(elem).getAttribute('partyid');

		for(var i in arr){
			if( arr[i].settings.name == document.getElementById(elem).getAttribute('id')){
				item = arr[i];
				item.timeline.to(item.settings.name,.1,{
					clearProps:'scale,left,top,width,height,rotation',
					onComplete:function(){item.timeline.pause()
						removeJig(arr[i])
					}
				})
				
			};
		}
	};
	// removes the Jig object from the party
	//--------------------------------------
	removeJig = function(obj){
		party = party.filter(
			function(item) { 
				if(item.settings.seed !== obj.settings.seed){
					return item; 
				}
		});
		//console.log('REMOVED JIG: '+obj.settings.name+' -- '+party.length);
	};

	// Used for click events, allows one to pause and unpause with a click
	// -------------------------------------------------------------------
	toggle = function(elem,model,parameters,spacing,random){

			var name = getName(elem);
			var domObj = getDom(elem);
			var elements;
			//----------------------------------------------------
			// if the element has not been made a jig object yet
			//---------------------------------------------------
			if(jigIndex(name,domObj) === -1){
				
				if(random){
					elements = mixUp(domObj);
				}else{
					elements = elem;
				}

				var instance = new preset(model,name,parameters,spacing,domObj);
				instance.init();
			}else{
			//----------------------------------------
			// if the element is already a jig object
			//----------------------------------------
				var i = jigIndex(name,domObj);

				if(party[i].stats.playing){
					party[i].pause();
				}else{
					party[i].play();
				}
				
			}		
	};

	// The single instanceof a jig animation
	//--------------------------------------
	jig = function(elem,model,parameters,delay,random,callBack){
		
		var name = getName(elem);
		var domObj = getDom(elem);
		
		if(random){
			domObj = mixUp(domObj);
		};
		//---------------------------------------------------
		// if the element has not been made a jig object yet
		//---------------------------------------------------
		if(jigIndex(name,domObj) === -1){
			var instance = new preset(model,name,parameters,delay,domObj,callBack);
			instance.init();
		};
	};

	//Instance Constructor
	//--------------------
	function preset(model,element,o,delay,domObj){

		var obj = {};
		var tl,
			dl,
			vars,
			seed;

		obj.anims=[];
		
		obj.settings = {
			seed:0,
			name:element,
			dom:domObj,
			
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
			startScaleY:1,
			startScaleX:1,
			endScaleX:1,
			endScaleY:1,
			
			aloofness:0,
			ease:'linear',
			exaggeration:0,
			
			startOpacity:1,
			endOpacity:1,

		};		
		
		obj.stats ={
			reps:undefined,
			playing:false,
			paused:false,
			complete:false,
			groupComplete:0,
			repPos:0
		};	
		// FUNCTIONS
		// -----------------------------------------------------------
		
		obj.loop = function(index){

			if(index == undefined ){
				if(obj.settings.repeat === 'forever' || obj.stats.reps<obj.settings.repeat){ 
					obj.stats.reps++;
					obj.anim();	
				}else{
					obj.stats.complete = true;
					if(callBack != undefined){
						obj.callBack();
					}
					removeJig(obj);
				}		

			}else{
				if(obj.settings.repeat === 'forever' || obj.stats.reps[index]<obj.settings.repeat){ 
					obj.stats.reps[index]++
					obj.anims[index]();
				}else{
					obj.stats.groupComplete++
					if(obj.stats.groupComplete == (obj.settings.dom.length) ){
						obj.stats.complete = true;
						removeJig(obj);
					};
				}
			}	
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

				if(obj.settings.repeat === 0){	
					for(var i in obj.anims){
						obj.anims[i]();
					}

				}else{
					for(var i in obj.anims){
						obj.loop(i);
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
			bol:obj.settings.bol,//boolean
			sH:obj.settings.startHeight
		};


		// this creates the primary timeline (obj.timeline) for the preset
		// ---------------------------------------------------
		obj.timeline = new TimelineLite({delay:obj.settings.delay});
		// Determine if we need to handle the lement as an array or a single DOM element
		// ----------------------------------------------------------------------------
		var dom = obj.settings.dom;
		var name = obj.settings.name;
		var thisDom;

		//console.log('domObj: '+dom);

		obj.anims = [];
		obj.stats.reps = [];

		for(var i in dom){
				
			obj.stats.reps.push(0);
			tl = new TimelineLite();
			dl = delay;
			obj.timeline.append(tl,dl);

			if(dom[i].tagName == name){
				thisDom = document.getElementsByTagName(name);
				obj.anims[i] = partial(model,obj,thisDom[i],vars,tl,dl,i);
			}else if(dom[i].className == name){
				thisDom = document.getElementsByClassName(name);
				obj.anims[i] = partial(model,obj,thisDom[i],vars,tl,dl,i);
			}else if(dom[i].id == name){
				thisDom = document.getElementById(name);
				obj.anims[i] = partial(model,obj,thisDom,vars,tl,dl,i);
			}else{
				thisDom = document.getElementById(name[i]);
				obj.anims[i] = partial(model,obj,thisDom,vars,tl,dl,i);
			}
			
		}

		// Push this preset object to the party array
		// ------------------------------------------
		party.push(obj);
		return obj;
	};

})(document);