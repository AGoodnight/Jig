Jig
===

Jig is intended to make it easier to instatiate and manage preset animations and behaviors utilizing Greensocks powerful TweenLite and TimelineLite.

While JQuery can do much of what Jig can and will be able to do, Jig's scope is smaller and it's target audience is predominatley web animators & motion designers, individuals who may or may not know any javascript. Greensock's Animation Platform is also much faster and less processor intensive than JQuery's animation features, while being easier to approach by non-developers.

--------------

jig( '#myDiv', { name:'theadore' })
  .auto( 'jump', settings:{ speed:1, life:4, repeat:3 }, timestamp:'1:41:22:0345').auto

//This is the current template for a jig object, an animation.

--------------

To learn more about GSAP, a javascript library complete with TimelineLite and Tweenlite, visit http://www.greensock.com/gsap-js/
