
(function(document){

	Jive = function(){
		return ExtendedTimeLine();
	};

	Jive.prototype.onStart = function(){
		this.settings.onStart();
	};

	jive.prototype.onEnd = function(){
		this.settings.onEnd();		
	};

})(document);	


//----------------------------------------------------

var loadSCORM,
	setSCORM;

var myTimeline = new Jive();
	
myTimeline.settings = new JiveSettings({
	onStart:loadSCORM, 
	onEnd:setSCORM, 
	name:'scene: Funky Chicken'
});

myTimeline.controller = new JiveController({
	controllerType:'scrubbie', 
	drag:'#dragger', 
	bounds:'#gutter'
});