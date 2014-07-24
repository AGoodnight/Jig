

(function(document){

	TimelineLite.prototype.unshift = function(o){
		var td = this.totalDuration();
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
		return msToTime(t);
	}


	TimelineLite.prototype.jig = function(selector,motion,like,settings){
		
		this.loop = function(){

		}

		this.data ={

			name:selector,
			dom:domArray(selector),

			stats:{
				reps:0
			},

			settings:{}
				speed:0
			},

		};

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

				obj.settings[j] = u;
			}
		};


	};

	// FUNCTIONS
	// =========
	var removePrefix = function(o){
		var name;
		switch(o){
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
	}

	var domArray = function(o){
		var arr;

		if(o instanceof Array || o instanceof Object){
			arr = o;
		}else{
			arr = [];
			var element;
			switch(o){
				// if an id
				case '#':
					arr = [document.getElementById(o.substr(1))];
				break;
				//if a class
				case '.':
					element = document.getElementsByClassName(o.substr(0));
					for(var i in element){
						arr.push(element[i]);
					}
				break;
				//if a tag or anything else
				default:
					try{
						element = document.getElementsByTagName(o);
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

	  return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs) + '.' + ms;
	};


})(document);