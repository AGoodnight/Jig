var library = {

		hop:{
			options:{
				_speed:1, 
				_amplitude:1,
				_rotation:15,
				_density:.7,
				_scale:1,
				_origin:'50% 100%', // ground

				_repeat:0
			},
			animation:function(actor,o,d){

				var q = new TimelineLite();
				// Your custom setting modifications		
				var s=[o._speed/6,o._speed/4,o._speed/5];
				var f = 0;
				for(var i in s){ f += s[i]; };
				s[3] = o._speed%f;

						
				var amp = (o._amplitude*-1)*o._self.data._height;
				
				// ------------------------------------------------------------------------------
				// We want to make our actor rotate a bit in the air, but we want it to alternate
				// ------------------------------------------------------------------------------
				o._self._boolean = o._self._boolean ? false : true;
				var b = o._self._boolean ? o._rotation+'deg' : (-1*o._rotation)+'deg';

				// ----------------------------------------
				// Assign animation to q (timeline)
				// ----------------------------------------
				q.add(
					TweenLite.to(actor,s[0],{
						delay:d,
						scaleX:o._scale*1+(1-o._density),
						scaleY:o._scale*1-(1-o._density),
						transformOrigin:o._origin,
						ease:'easeIn'
					})
				);
						
				q.add(
					TweenLite.to(actor,s[1],{
						scaleX:o._scale*1-(.9-o._density),
						scaleY:o._scale*1+(.9-o._density),
						y:amp,
						transformOrigin:o._origin,
						ease:'linearOut',
						rotation:b
					})
				);

				q.add(
					TweenLite.to(actor,s[2],{
						scaleX:o._scale*.8+(1-o._density),
						scaleY:o._scale*1-(1-o._density),
						y:0,
						ease:'easeIn',
						rotation:0
					})
				);

				q.add(
					TweenLite.to(actor,s[3],{
						scaleX:o._scale,
						scaleY:o._scale,
						y:0,
						ease:'linearOut'
					})
				);

				return q;
			}
		}		
	};
