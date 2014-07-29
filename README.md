Jig
===

Jig is intended to make it easier to instatiate and manage preset animations and behaviors utilizing Greensocks powerful TweenLite and TimelineLite.

While JQuery can do much of what Jig can and will be able to do, Jig's scope is smaller and it's target audience is predominatley web animators & motion designers, individuals who may or may not know any javascript. Greensock's Animation Platform is also much faster and less processor intensive than JQuery's animation features, while being easier to approach by non-developers.

<pre>
jig('#myDiv').rollOver('wiggle');
</pre>

<pre>
jig( '#myDiv', { name:'theadore' })
  .rollover( 'jump', settings:{ speed:1, life:4, repeat:3 }, timestamp:'1:41:22:0345')
  .trigger(function(){
  
    arthurcclarke();
    starwars();
    tng();
    
    console.log('I have been clicked');
    
    tuna = true
    mayo = false
    
  }, 'spin', settings:{speed:.3, life:8});
</pre>

To learn more about GSAP, a javascript library complete with TimelineLite and Tweenlite, visit http://www.greensock.com/gsap-js/
