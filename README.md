Jig
===

Jig is intended to make it easier to instatiate and manage preset animations and behaviors utilizing Greensocks powerful TweenLite and TimelineLite.

While JQuery can do much of what Jig can and will be able to do, Jig's scope is smaller and it's target audience is predominatley web animators & motion designers, individuals who may or may not know any javascript. Greensock's Animation Platform is also much faster and less processor intensive than JQuery's animation features, while being easier to approach by non-developers, making Jig's core animation functions simple to understand and customize.


<pre>
Jig('#myDiv').rollOver('wiggle');

var myButtons = Jig('.myclass').wiggle('lively');
</pre>

<pre>
var f = new Jig('.dolphin')
			.mouse('#seal',true,'click')
			.wiggle('lively',{repeat:2,stagger:.1})
			.wiggle('lively',{stagger:.1});
</pre>

To learn more about GSAP, a javascript library complete with TimelineLite and Tweenlite, visit http://www.greensock.com/gsap-js/
