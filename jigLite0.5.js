var g = new Jig();
console.log(g);

/*var hopping = g.hop({
	delay:1,
	speed:1.3,
	alt:false,
	amplitude:3
},10);

console.log(hopping.phone);*/


// 'sticks' an animation directly to a timeline using the native TimelineLite methods

function Jig( options ){

	return (function(){
		
		//injectValues( options, gs )
		//return new TimelineLite();
		return {};

	});
}

Object.prototype.stick = function(zig,options){



	// variables ----------------------

	// private constants some of which can be overridden by the developer if desired
	var tween = TweenLite;
	var tl = TimelineLite;
	var label = overrideValue(options,'untitled');
	var	piggy = overrideValue(options, true);
	var	cycles = overrideValue(options, 1);
	

	// we change our private constants based on the user options defined
	

	// returned
	var dataObj = { 
		'type':zig.type,
		'label':name,
		'piggy':piggy, 
		'loops':(cycles-1)
	};

	// methods ------------------------

	for( var i = 0 ; i<cycles.length ; i++ ){

		if(piggy){

			// append to timeline

		}

	}

	// return -------------------------



	return dataObj;

}

// 'initiates' an instance of animation to the object in question

Object.prototype.hop = function(options){

	var e = {
		j:this,
		tag:overrideValue(options,'untitled')
	}

	// function instance 
	// -------------------
	return (function(e,j){

		var created = {};//TimelineLite.zig( library.hop, arguments );
		var parent = {};//j.stick( 'mytimeline' , created );

		var instance = {
			'type':'hop',
			'label':e.tag,
			'defaults':defaults
		}

		return instance;

	})(e,j);

};



// public functions

// --------------------------------------------------------
var overrideValues = function overrideValues( args,into ){
// --------------------------------------------------------
		for( var i = 0 ; i<1 ; i++){
			if( isValue( arg,into ) ){
					
			}
		}

		// - - - - - - - -

		function isValue( a,b ){

			// compare q with d

		}

		// TEMPORARY ++++++
		return true;

};