Jig
===

<b>Jigs</b> are intended to make it easier to instantiate and manage preset animations and behaviors utilizing Greensocks powerful TweenLite and TimelineLite.

<p>While JQuery can do much of what Jig can and will be able to do, Jig's scope is smaller and it's target audience is predominatley web animators & motion designers, individuals who may or may not know any javascript. Greensock's Animation Platform is also much faster and less processor intensive than JQuery's animation features, while being easier to approach by non-developers, making Jig's core animation functions simple to understand and customize.</p>

<p>A 'jig' is a timeline that controls a particular DOM elements animations/timelines.</p>

<p>A 'zig' is a single instance of a preset/custom timeline that is added to the jig</p>

<p>A 'ziggle' is a fragment of animation on a Zig/timeline</p>
<p>With these 'conceptual models', timeline animaton in javascript becomes a bit less ambiguous, and that is the why I created Jig</p>

<br/>
<hr/>
<h1>Examples</h1>

<p>Below is a a div that hops when you click it. It also pauses if you click it again.</p>

<pre>
jig('#tng').click(true).hop();
</pre>
<br/>

<p>Below, the first argument refers to a preset variation of the 'hop' zig, while the last argument tells it 'when' (in seconds) to animate.</p>

<pre>
jig('#tng').click(true).hop('lively',1);
</pre>
<br/>


<p>Below is a more complex example utilizing a 'piggyback' jig, which will animate each zig in succession. Also, when you rollover any DOM element of the specified class the animation pauses.</p>

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
<br/>

<p>You can even add custom animation in the classic GSAP fashion by using the 'tween' zig. just make sure to follow the syntax below
<pre>
jig('.rocko').tween( function(ziggle,actor){ 

      ziggle.add(
           TweenLite.to(actor,1,{ x:100 });
      );
      
      return ziggle
})
</pre>
<br/>

<p>Jig is far from complete, it is my hope that it will allow easy layering of animations, much like flash at some point in the future. However I would like to keep it independnet of Jquery, and that is a real challenge.</p>
<br/>

<p>To learn more about GSAP, a javascript library complete with TimelineLite and Tweenlite, visit http://www.greensock.com/gsap-js/</p>
