(function(document){

	function jig(){
		obj = {};
		obj.settings{
			speed:1,
			spunk:1,
			squish:1,
			repeat:1
		};
		obj.state{
			rep:0,
			playing:false
		};

		// Set Parameters and convert tempo to speed
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

		return obj;
	}

	jump = function(element,parameters,repeat){
		new jig(parameters)
	}

})(document);
