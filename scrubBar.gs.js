(function(document){

	scrubBar = function(scrubber,gutter,timeline){
		
		//console.log(timeline)
		var _this = this;
		this.scrubber = scrubber;
		this.gutter = gutter;
		this.tl = timeline;
		this.width = 350;
		this.drag = Draggable.create(scrubber,{type:"x",edgeResistance:1,bounds:gutter,onDrag:handleDrag ,onDragEnd:handleRelease})[0];
		function handleDrag(){

			var max = _this.width;
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
			//console.log(timeline.time())
		},10)

		return this;
	};

	scrubBar.prototype.newBounds = function(){
		//console.log(this.tl.currentMark)
		if(this.tl.currentMark >= this.marks.length){
			this.drag.applyBounds(this.gutter);
		}else{
			this.tl.addPause(this.marks[this.tl.currentMark].time);
			this.drag.applyBounds({
				top:0,
				left:0,
				width:this.marks[this.tl.currentMark].pos,
				height:0
			});
		}
		this.tl.play();
	};

	scrubBar.prototype.drawMarkers = function(divs){
		var j = 0;
		var arr = [];

		for(var i in this.tl._labels){

			var lab = this.tl._labels[i];
			var td = this.tl.totalDuration();
			var w = this.width;

			arr.push({
				pos:lab/td*350,
				time:this.tl._labels[i]
			});

			divs[j].style.left = String(lab/td*350)+'px';
			j++
		}

		this.marks = arr;
	};

})(document);