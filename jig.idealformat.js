
jig('#mydiv').wiggle().shake().roll()

jig('#mydiv').grow('bigger')

jig('.myclass').jump('livley',{to:'.thesky', speed:'quickly'});

jig.('button').grow('slightly',{ speed:'quickly' });




var v = jig.('button').grow('slightly',{ speed:'quickly' });
// also

jig('button',{from:1, until:3})
	.toggle('self')
	.jump('lively'{ loop:'forever'});


var cool_button = jig('button')
					.toggle('modal')
					.disappear('completely',{ /*settings*/ })
					// if toggle
					.onMouseDown('fancy',{ /* settings */ },function(){ /*your functions*/ });


cool_button._toggle = 'another modal';
cool_button.disappear('slightly');

var Party = Jive(
				cool_button,
				stupid_button
);



// Jams Plug-In

atrack.record('startupNoise','.../jams/synth-pop.mp3');
atrack.startupNoise(); // plays a sound
atrack.play(from:10,until:'yourmom');
