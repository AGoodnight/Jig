Jig
===

Jig is intended to make it easier to instatiate and manage preset animations and behaviors utilizing Greensocks powerful TweenLite and TimelineLite.

While JQuery can do much of what Jig can and will be able to do, Jig's scope is smaller and it's target audience is predominatley web animators & motion designers, individuals who may or may not know any javascript. Greensock's Animation Platform is also much faster and less processor intensive than JQuery's animation features, while being easier to approach by non-developers, making Jig's core animation functions simple to understand and customize.

A Jig is a timeline that controls a particular DOM elements animations/timelines.
<br/>
A Zig is a single instance of a preset/custom timeline
<br/>
A Ziggle is a fragment of animation on a Zig/timeline

<pre>
jig('#tng').click(true).hop();
</pre>
<pre>
jig('#tng').click(true).hop('lively',1); <-- the last argument tells it 'when' to animate
</pre>
<pre>
jig('.starwars',{type:'piggyback'})
      .rollover()
      .wiggle()
      .spin({
        speed:.6,
        rotationX:180,
        stagger:.2,
        ease:'easeInOut'
      });
</pre>

To learn more about GSAP, a javascript library complete with TimelineLite and Tweenlite, visit http://www.greensock.com/gsap-js/
