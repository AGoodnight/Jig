;(function(document){
	

jive = function(jigs,settings){
	
	var q = new TimelineLite({paused:true});

	q.data = {
		// attributes
		_name:undefined,
		// playback
		_delay:0,
		_complete:false
	};

	q.jigs = jigs;
	q.controller = [];
	q._resume = false;

	for(var i in jigs){
		q.add(jigs[i],0);
		if(jigs[i]._paused){
			jigs[i].play();
		}
	}

	return q;
};

TimelineLite.prototype.scrubber = function(scrubber){
	
	// -----------------------------------
	// Local Variables
	// -----------------------------------	
	var node = nodeSelector(scrubber)[0];
	var elementNodes = getChildNodes('DIV',node);
	var gutterWidth = window.getComputedStyle(node).getPropertyValue('width');
	var bugWidth = window.getComputedStyle(elementNodes[1]).getPropertyValue('width');
	var timeline = this;

	// -----------------------------------
	// The Controller Object
	// -----------------------------------
	var q = {

		_type:'SCRUBBER',
		_watch:null,
		_dragging:false,

		_tl:this, // TimelineLite instance
		_node:node,
		_nodeString:scrubber,
		_fill:elementNodes[0],
		_bug:elementNodes[1],

		_gutterWidth:gutterWidth,
		_bugWidth:bugWidth,
		_refresh:10,

		// -----------------------------------------------------------------------------------------------
		// Theses functions are only for a scrubber instance, so they can live inside the scrubber object
		// -----------------------------------------------------------------------------------------------
		setRefresh:function(n){
			this._refresh = n;
			clearInterval(this._watch);
			this.start();
		},
		start:function(){

			// ---------------------------------------------------
			// Redraw the scrubber based on the _refresh variable
			// ---------------------------------------------------
			q._watch = setInterval(function(){

				var ct = timeline.time();
				var td = timeline.totalDuration()
	
		 		// Our bug (the thing you drag) has a width which needs to be incremently compensated for to remain INSIDE our gutter.
				var bugComp = parseInt( bugWidth )*ct/td;
				var progress = ( ct/td*parseInt(gutterWidth) )

				if(!timeline._paused){
					TweenLite.set(elementNodes[1],{x:progress-bugComp})
				}

				TweenLite.set(elementNodes[0],{width:progress})

			},q._refresh);
		},
		handleDrag:function(){

			var max = parseInt(gutterWidth);
			var g = Math.round(Draggable.get(elementNodes[1]).x);
			var ct = timeline.time();
			var td = timeline.totalDuration()

			var bugComp = parseInt( bugWidth )*ct/td;

			if(g>max){ g = max }else if(g<0){ g = 0 }else{ g = g };
			
			if(!timeline.controller._dragging){
				if(timeline._paused){
					timeline._resume = false;
				}else{
					timeline._resume = true;
				}
			}

			timeline.pause();
			timeline.seek((g+bugComp)/max*td);
			timeline.controller._dragging = true;
		},	
		handleRelease:function(){

			if(timeline._resume){
				timeline.play(); 
			}else{
				timeline.pause();
			}

			timeline.controller._dragging = false;
		}
	};

	// -----------------------------------
	// Create a Draggable
	// -----------------------------------
	q.Draggable = Draggable.create(elementNodes[1],{
		type:"x",
		edgeResistance:1,
		bounds:node,
		onDrag:q.handleDrag,
		onDragEnd:q.handleRelease
	})[0];

	// ------------------------------------------------------
	// Make the controller accesible via the timeline object
	// ------------------------------------------------------
	q.start();
	this.controller=q;

	// -----------------------------------
	// RETURN
	// -----------------------------------
	return this;
};

function getChildNodes(nodeName,n){
	var arr = [];

	if(n.hasChildNodes()){
		for(var i in n.childNodes){
			if(n.childNodes[i].nodeName === nodeName){
				arr.push(n.childNodes[i]);
			}
		}
	}

	return arr;
};


})(document);