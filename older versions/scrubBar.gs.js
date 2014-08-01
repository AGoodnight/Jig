(function(document){

	scrubBar = function(scrubber,gutter,timeline){
	
		var _this = this;
		this.scrubber = scrubber;
		this.gutter = gutter;
		this.tl = timeline;
		this.width = 350;
		this.drag = Draggable.create(scrubber,
		{
			type:"x",
			edgeResistance:1,
			bounds:gutter,
			onDrag:this.handleDrag,
			onDragEnd:this.handleRelease
		})[0];

		this.start();

	};

	scrubBar.prototype.start = function(){
		setInterval(function(){
			var cx = Draggable.get(this.scrubber).x;
			var ct = this.tl.time();
			var td = this.tl.totalDuration()
			TweenLite.set(this.scrubber,{x:ct/td*350})
			//console.log(timeline.time())
		}.bind(this),10);
	};

	scrubBar.prototype.handleDrag = function(){
		
		var max = this.width;
		var g = Math.round(Draggable.get(this.scrubber).x);
		var td = this.tl.totalDuration();
			
			if(g>350){
				g = max
			}else if(g<0){
				g = 0
			}else{
				g = g
			}

		this.tl.seek(g/max*td);
		this.tl.pause();
	};
	
	scrubBar.prototype.handleRelease = function(){
		this.tl.play(); 
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