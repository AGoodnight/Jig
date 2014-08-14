(function(document){

	wiggle=function(obj,elem,vars,timeline,delay2,index){
	
		var v = vars;
		var tl = timeline;

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

		tl.call(obj.loop,[index]);

	};
	
	jump=function(obj,elem,vars,timeline,delay2,index){

		var v = vars;
		var tl = timeline;
		var s = [v.speed/8, v.speed/3, v.speed/6,v.speed/8];
		// PARAM: aloofness
		v.bol = v.bol ? false : true;
		b = v.bol ? v.aloof+'deg' : (-1*v.aloof)+'deg';

		// PARAM: exaggeration
		var ex = (1*v.exag)/100;
				
		// MAIN SEQUENCE
		// --------------
		//1 windup

		tl.to(elem,s[0],{
			scaleX:(1+ex),
			scaleY:(1-ex),
			top:0,
			ease:'easeIn',
			transformOrigin:'50% 100%'
		});
				
		//2 launch

		tl.to(elem,s[1],{
			scaleX:(1-ex),
			scaleY:(1+ex),
			top:v.amp*-1,
			ease:'easeOut',
			rotation:b
		});
				
		//4 fall

		tl.to(elem,s[2],{
			scaleX:(1-ex),
			scaleY:(1+ex),
			top:0,
			ease:'easeIn',
			rotation:0
		});
				
		//6 rest
		
		tl.to(elem,s[3],{
			scaleX:1,
			scaleY:1,
			top:0,
			ease:'linear'
		});

		tl.call(obj.loop,[index])

	};

	plop=function(obj,elem,vars,timeline,delay2,index){

		var v = vars;
		var tl = timeline;
		var s = [v.speed/3, v.speed/6, v.speed/4,v.speed/5,v.speed/3];

		// PARAM: exaggeration
		var ex = (1*v.exag)/100;
				
		// MAIN SEQUENCE
		// --------------
		//1 windup//fall

		tl.fromTo(elem,s[0],{
			left:v.sx,
			top:-v.sy,
			scaleX:1,
			scaleY:1,
			opacity:v.opaS,
			transformOrigin:'50% 100%',
			ease:'linear'
		},{
			top:v.ey,
			scaleX:1-ex,
			scaleY:1+ex,
			opacity:v.opaE,
			ease:'linear'
		});

			//land
			
		tl.to(elem,s[1],{
			top:0,
			scaleX:1+ex,
			scaleY:1-ex,
			ease:'easeInCirc'
		});

			//rest

		tl.to(elem,s[2],{
			top:0,
			scaleX:1,
			scaleY:1,
			ease:'easeOutCirc'
		});

			//rebound
			
		tl.to(elem,s[3],{
			scaleX:1-ex,
			scaleY:1+ex,
			ease:'easeInOutCirc'
		});

			//rest

		tl.to(elem,s[4],{
			top:0,
			scaleX:1,
			scaleY:1,
			ease:'easeInOutCirc'
		});


		tl.call(obj.loop,[index])

	};

	fly=function(obj,elem,vars,timeline,delay2,index){

		var v = vars;
		var tl = timeline;
		// PARAM: exaggeration
		var ex = (1*v.exag)/100;
		
		tl.fromTo(elem,v.speed,{
			left:v.sx,
			top:v.sy,
			rotation:v.rot,
			scaleY:v.ss,
			ease:v.e,
			opacity:v.opaS,
			transformOrigin:"50% 0%"
		},{
			left:v.ex,
			top:v.ey,
			rotation:0,
			scale:v.es,
			scaleY:1,
			scaleX:1,
			ease:v.e,
			opacity:v.opaE
		});



		tl.call(obj.loop,[index])

	};

	pulse=function(obj,elem,vars,timeline,delay2,index){

		var v = vars;
		var tl = timeline;
		// PARAM: exaggeration
		var ex = (1*v.exag)/100;
		
		tl.to(elem,v.speed/2,{
			scale:v.es,
			rotation:v.rot
		});

		tl.to(elem,v.speed/2,{
			scale:v.ss,
			rotation:0
		});

		tl.call(obj.loop,[index])

	};

	spin=function(obj,elem,vars,timeline,delay2,index){

		var v = vars;
		var tl = timeline;
		// PARAM: exaggeration
		var ex = (1*v.exag)/100;
		
		tl.to(elem,v.speed,{
			ease:v.ease,
			rotation:'+='+v.rot
		});

		tl.call(obj.loop,[index])

	};

	sonar=function(obj,elem,vars,timeline,delay2,index){

		var v = vars;
		var tl = timeline;

		clones = [];

		for(var c = 0 ; c<4 ; c++){
			var orig = document.getElementById(obj.settings.name)
			clone = orig.cloneNode(true);
			clone.id = 'clone'+c
			clone.style.position = 'absolute'

			clones.push(clone);

			var parent = orig.parentNode;
			parent.appendChild(clone);
		};

		for(var c in clones){

			tl.fromTo(clones[c],1,{
				scale:1,
				opacity:1
			},{
				scale:2,
				opacity:0
			},c/4);

		};


		tl.call(obj.loop,[index]);


	}

	/*sideStep = function(elem,obj){
	
		var _me = new preset(elem,obj);
		var _tl = _me.timeline;

		_me.anim = function(vars){
			var v = vars;	

			_tl.to(elem,.2,{
				scaleX:1.1,
				scaleY:.9,
				transformOrigin:'50% 100%',
				ease:'easeInExpo'
			});

			_tl.to(elem,.4,{
				scaleX:.9,
				scaleY:1.1,
				rotation:-20,
				bottom:50
		
			});

			_tl.to(elem,.2,{
				scaleX:1.1,
				scaleY:.9,
				bottom:0,
				rotation:0,
				transformOrigin:'50% 100%',
				ease:'easeInExpo'
			});

			_tl.to(elem,.4,{
				scaleX:.9,
				scaleY:1.1,
				rotation:20,
				bottom:50
			});

			_tl.to(elem,.2,{
				scaleX:1,
				scaleY:1,
				bottom:0,
				rotation:0,
				transformOrigin:'50% 100%',
				ease:'easeInExpo'
			});


			_tl.call(_me.loop);
		};

		_me.init();
	};*/

})(document);

	