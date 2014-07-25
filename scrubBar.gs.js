(function(document){
	

	scrubBar = function(scrubber,gutter,timeline){
		
		//console.log(timeline)
		Draggable.create(scrubber,{type:"x",edgeResistance:.65,bounds:gutter,onDrag:handleDrag ,onDragEnd:handleRelease});

		function handleDrag(){

			var max = 350;
			var g = Math.round(Draggable.get(scrubber).x);
			var td = timeline.totalDuration();
			
			if(g>350){
				g = max
			}else if(g<0){
				g = 0
			}else{
				g = g
			}

			timeline.seek(g/max*td);
			timeline.pause();
		};

		function handleRelease(){ timeline.play(); };

		setInterval(function(){
			var cx = Draggable.get(scrubber).x;
			var ct = timeline.time();
			var td = timeline.totalDuration()
			TweenLite.set(scrubber,{x:ct/td*350})
			console.log(td)
		},10);

	}

})(document);