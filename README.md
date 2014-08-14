Jig
===

<b>Jigs</b> are intended to make it easier to instantiate and manage preset animations and behaviors utilizing Greensocks powerful TweenLite and TimelineLite.

While JQuery can do much of what Jig can and will be able to do, Jig's scope is smaller and it's target audience is predominatley web animators & motion designers, individuals who may or may not know any javascript. Greensock's Animation Platform is also much faster and less processor intensive than JQuery's animation features, while being easier to approach by non-developers, making Jig's core animation functions simple to understand and customize.
<br/>
The current iteration of the Jig project is <b>'JigLite'</b>
<br/>

A Jig is a timeline that controls a particular DOM elements animations/timelines.
<br/>
A Zig is a single instance of a preset/custom timeline
<br/>
A Ziggle is a fragment of animation on a Zig/timeline
<br/><br/><br/>
Below is a a div that hops when you click it. It also pauses if you click it again.
<pre>
jig('#tng').click(true).hop();
</pre>
<br/>
Below, the first argument refers to a preset variation of the 'hop' zig, while the last argument tells it 'when' (in seconds) to animate.
<pre>
jig('#tng').click(true).hop('lively',1);
</pre>
<br/>
Below is a more complex example utilizing a 'piggyback' jig, which will animate each zig in succession. Also, when you rollover any DOM element of the specified class the animation pauses.
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
<br/><br/>
To learn more about GSAP, a javascript library complete with TimelineLite and Tweenlite, visit http://www.greensock.com/gsap-js/
