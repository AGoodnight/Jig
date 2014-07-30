Jig
===

Jig is intended to make it easier to instatiate and manage preset animations and behaviors utilizing Greensocks powerful TweenLite and TimelineLite.

While JQuery can do much of what Jig can and will be able to do, Jig's scope is smaller and it's target audience is predominatley web animators & motion designers, individuals who may or may not know any javascript. Greensock's Animation Platform is also much faster and less processor intensive than JQuery's animation features, while being easier to approach by non-developers, making Jig's core animation functions simple to understand and customize.


<pre>
Jig('#myDiv').rollOver('wiggle');

var myButtons = Jig('.myclass').trigger(myFunction);
</pre>

<pre>
var blackWiggle = Jig('#black')
			.auto('wiggle',
				{amplitude:20,repeat:2})
			.auto('wiggle',2)
			.auto('wiggle',{speed:.5,rotation:40},5)
</pre>

To learn more about GSAP, a javascript library complete with TimelineLite and Tweenlite, visit http://www.greensock.com/gsap-js/
