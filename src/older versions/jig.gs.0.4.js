

(function(document){

	jig = function(what){

		var obj = new TimelineLite();
		obj.node = domArray(what);
		obj.trigger = {
			active:false
		}
		return obj;
	};

	presets = {
		pulse:function(){
			console.log('pulsing');
		},
		
		wiggle:function(myObj,domObj,timeline,vars,index){
			
			console.log(domObj);

			var v = vars;
			var tl = timeline;
			var elem = domObj;

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

			tl.call(myObj.loop,[index]);
		}
	};

	TimelineLite.prototype.audioTrack = {

		track:undefined,
		duration:undefined,
		progress:undefined,

		set:function(input){
			console.log('Audio set: '+input)
		},
		play:function(){},
		pause:function(){}
	};
	TimelineLite.prototype.unshift = function(o,delay){
		var td = (this.totalDuration())+delay;
		this.add(o,'-='+td);
		console.log('pushed '+o)
	};
	TimelineLite.prototype.sync = function(o,time){
		
		var when = timeToMs(time);

		this.add(o,'-='+when);
		console.log('pushed '+o)
	};
	TimelineLite.prototype.getTimestamp = function(){
		var t = this.time();
		return msToTime(t*1000);
	};
	TimelineLite.prototype.loop = function(selector,settings){
	};
	TimelineLite.prototype.toggle = function(selector,speed,settings){
		
		this.node;
		this.trigger;

		var b = new jive(b,selector,speed,settings);
		
		if(!active){
			b.play();
		};

	};

	jive = function(selector,speed,settings){

		var obj={};
		obj.a = domArray(selector);
		
		obj.play = function(){
			for(var i in obj.a){
				console.log(obj.a[i]);
			};
		};

		var b = new TimelineLite();
		b.append();

		return b;

		/*var _this = this;
		var g =0;

		this.jives=[];

		this.data ={
			name:selector,
			dom:domArray(selector),

			stats:{
				reps:[0]
			},

			settings:{
				speed:speed,
				amplitude:1,
				rotation:0,
				ease:'easeInOut',
				repeat:0,
				offset:0,
				preset:'pulse'
			},
		};

		if(this.data.dom instanceof Array){
			for(var i in this.data.dom){
				this.data.stats.reps.push(0);
			}
		}

		this.loop =function(index){
			console.log('-------------------')
			if(index == undefined ){
				if(_this.data.settings.repeat === 'forever' || _this.data.stats.reps[0]<_this.data.settings.repeat){ 
					_this.data.stats.reps[0]++;
					_this.jives[0]();	
				}else{
					_this.trigger.active = false;
					_this.data.stats.reps = 0;
				}		

			}else{
				if(_this.data.settings.repeat === 'forever' || _this.data.stats.reps[index]<_this.data.settings.repeat){ 
					_this.data.stats.reps[index]++
					_this.jives[index]();
				}else{
					if(_this.data.stats.reps[index] == (_this.data.dom.length)-1 ){
						g++
					};
				}
				if(g == (_this.data.dom.length)){
					g = 0;
					for(var i in _this.data.stats.reps){
						_this.data.stats.reps[i] = 0;
					}
					_this.trigger.active = false;

				};
			}	
		}

		for(var j in settings){
			if(settings[j] != undefined){

				var u;
				var secs;

				// Beats per Minute or Speed (in seconds)?
				if(j=='speed'){
					u = settings[j];
					j = 'speed';
				}else if(j=='bpm'){
					secs = 60/settings[j]
					u = secs*1.2
					j = 'speed';
				}else{
					u = settings[j];
				}

				this.data.settings[j] = u;
			}
		};

		var doms = this.data.dom;
		var vars = {
			speed:this.data.settings.speed,
			amp:this.data.settings.amplitude,
			rot:this.data.settings.rotation,
			e:this.data.settings.ease
		}


		if(doms instanceof Array){
			for(var i in doms){
				tl = new TimelineLite();
				this.jives.push(
					partial(presets[this.data.settings.preset],this,doms[i],tl,vars,i)
				)
				this.jives[i]();
				this.unshift(tl,_this.data.settings.offset);
			};
		}else{

		};*/
	};


	// FUNCTIONS
	// =========
	var partial = function(func /*, 0..n args */) {
  		var args = Array.prototype.slice.call(arguments).splice(1);
  		return function() {
    		var allArguments = args.concat(Array.prototype.slice.call(arguments));
    		return func.apply(this, allArguments);
 	 	};
	};

	var removePrefix = function(o){
		var name;
		switch(o[0]){
				// if an id
				case '#':
					name = o.substr(1);
				break;
				//if a class
				case '.':
					name = o.substr(0);
				break;
				//if a tag or anything else
				default:
					name = o
				break;
			}
		return name;
	};

	var domArray = function(o){
		var arr;
		var element;

		if(o instanceof Array || o instanceof Object){
			arr = o; // needs to return actual objects
		}else{
			arr = [];

			switch(o[0]){
				// if an id
				case '#':
					arr = [document.getElementById(o.substr(1))];
				break;
				//if a class -- this is acting funny
				case '.':
					element = Array.prototype.slice.call(document.getElementsByClassName(o.substr(1)));
					for(var i in element){
						arr.push(element[i]);
					}
				break;
				//if a tag or anything else
				default:
					try{
						element = Array.prototype.slice.call(document.getElementsByTagName(o));
						for(var i in element){
							arr.push(element[i]);
						}
					}catch(err){console.log('Selector is not valid, see documentation')};
				break;
			}
		}
		return arr;
	};

	var timeToMs = function(time){
		
		// time m:s:ms
		var m = Number(time.split(':')[0])
		var s = Number(time.split(':')[1])
		var ms = Number(time.split(':')[2])
		var d = (m*60+s*1000)+ms

		return d;
	};

	function msToTime(s) {
	  function addZ(n) {
	    return (n<10? '0':'') + n;
	  }

	  var ms = s % 1000;
	  s = (s - ms) / 1000;
	  var secs = s % 60;
	  s = (s - secs) / 60;
	  var mins = s % 60;
	  var hrs = (s - mins) / 60;

	  return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs) + '.' + Math.round(ms);
	};


})(document);