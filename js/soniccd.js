function handlePage(){

	// Jig should always come first unless it is dependnet on other variables
	// ----------------------------------------------------------------------
	jig(['#navigation'],fly,{
		startOpacity:0
	},.3);

	jig('.row',plop,{
		startScale:.3,
		startOpacity:0,
		startY:2000,
		speed:.8,
		exaggeration:10
	},.2)
	
	jig('figure',fly,{
		startX:100,
		startOpacity:0
	},.3);

	jig('li',fly,{
		startX:100,
		startOpacity:0
	},.3);

	jig('h2',fly,{
		rotation:100,
		startY:-50,
		startOpacity:0
	},.3);

	jig('.movie',fly,{
		startY:-50,
		startOpacity:0
	},.3);

	jig('.planet',spin,{
		rotation:360,
		speed:20,
		repeat:'forever'
	});

	//jig(['#top'],sonar);

	assignToGlobal(party,false,['planet']);
	/*var Jig = getJig('top');
	assignToGlobal(Jig,true);*/

	//addTojig('.planet',wiggle,{amplitude:20,speed:.4});

	// Set up our scrubbar
	// -------------------
	Draggable.create("#dragger",{type:"x",edgeResistance:.65,bounds:'#scrubber',onDrag:handleDrag ,onDragEnd:handleRelease});
	TweenLite.to(document.getElementsByTagName('body'),.2,{opacity:1});

	function handleDrag(){

		var max = 350;
		var g = Math.round(Draggable.get("#dragger").x)
		var td = gl.totalDuration()
		
		if(g>350){
			g = max
		}else if(g<0){
			g = 0
		}else{
			g = g
		}

		
		gl.seek(g/max*td);
		gl.pause();
	};

	function handleRelease(){ gl.play(); };

	setInterval(function(){
		var cx = Draggable.get('#dragger').x;
		var ct = gl.time();
		var td = gl.totalDuration()
		TweenLite.set('#dragger',{x:ct/td*350})
	},20);

};