(function(document){

	// Timeline Types
	// ====================================================================================

	// Master is the animations top tier timeline
	// ------------------------------------------
	/*function master(){
		this.timeline = new TimelineLite();
		this.data = {};
		this.push = function(){}
		this.append = function(){}
		this.sync = function(){}
		this.init = function(){}; //different name to reduce confusion
	}

	// Each master has many scenes
	// ---------------------------
	function scene(){
		this.timeline = new TimelineLite();
		this.data = { name:'My Name is Frank' }
		this.push = function(jive){
			this.timeline.add(jive.timeline,'-='+this.timeline.totalDuration());
			this.data[jive] = jive.data
		};
		this.append = function(jive){
			this.timeline.add(jive.timeline);
			this.data[jive] = jive.data
		};
		this.sync = function(jive){
			this.timeline.add(jive.timeline,'-='+this.timeline.totalDuration());
			this.data[jive] = jive.data
		};
		this.run = function(){};
	}

	// Each scene has many jives
	// -------------------------
	function jive(){
		this.timeline = new TimelineLite();
		this.data = { name:'My Name is Frank' }
		this.push = function(){};
		this.append = function(){};
		this.sync = function(){};
		//this.run is omitted to prevent mischief

	}*/

	var jive = function();
	TimelineLite.prototype = new jive();



	// Each jive has many jigs or jiggles
	// ----------------------------------
	function single(){}
	function stack(){}
	jig = function(){ new single(); }
	jiggle = function(){ new stack(); }

	
	// Sample Commands
	// ===================================================================================
	
	// -----------------------------------------------------
	var mobius = new scene();
	var battle = new jive();

	var flyAbove = jig(['#sonic','#amy'],fly,'bird',{speed:1})	
	/* The element becomes reserved and cannot be animated again until it finishes. mostly used 
	for user interaction, however it can be used to restrict access, reducing interference*/

	var engineProblems = jiggle('#knuckles',fly,'whale',{speed:1});
	// The element remains open to be animated again

	var wiggo = jig('#knuckles',wiggle,'bug',{speed:1});
	engineProblems.assign(wiggo); 
	/* we can assign an instance of jig or jiggle to a jiggle, this assigns the timeline of 
	'wiggo' to engineProblems and destroys the wiggo jig object. Also the element
	affected by wiggo is open to further manipulation like its parent 'engineProblems'*/

	battle.push(flyAbove); 
	// place this jig before all other jig/timelines on the battle timeline.

	battle.sync(engineProblems,'1:00:20'); 
	// place this jiggle at a point in the battle timeline/jive.

	mobius.append(battle)
	// append to the scene

	// -----------------------------------------------------
	var deathEgg = new Scene();
	var escape = new jive();

	var evadeEnemies = jiggle('#sonic',zip,'hedgehog',{speed:.1});
	var smashBoss = jig();
	var bossReaction = jiggle();
	smashBoss.assign( bossReaction, 1.2 ); 
	/* same as 'engineProblems' example, however now the jiggle 'jumpo' is nested 
	within the reserved jig, so it's DOM element cannot be affectd again until the 
	animation completes. also we can delay bossReaction by 1.2 seconds*/

	domBtn.onmousedown = function(){
		// since we don't want the user to stack the animation, we made 'smashBoss' a jig.
		smashBoss();
	};

	deathEgg.append(evadeEnemies); 
	// we don't include the jig [ append(evadeEnemies,smashBoss) ], because it is event based. instead...

	deathEgg.rest(smashBoss,'1:00:34')
	/* tell the deathEgg timeline to PAUSE and wait for the user to run the neccessary 
	Jig at a certain point. After the jig has been run, deathEgg will resume*/

	//--------------------------------------------------------
	master.append(mobius,deathEgg);
	// you can also sync and push scenes as well.

	master.init();
	// runs all the scenes as dictated by assignment.

	/* you can run individual scenes at anytime. By doing so, if a master is present this
	function will create a clone of the jive object, play it, and then destroy itself,
	this way the master is unaffected*/
	deathEgg.run();
	mobius.run();


})(document)