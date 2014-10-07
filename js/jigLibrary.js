TimelineLite.prototype.hop = function(){
	return this.zigInstance('hop',arguments);
};
TimelineLite.prototype.plop = function(){
	return this.zigInstance('plop',arguments);
};
TimelineLite.prototype.spin = function(){
	return this.zigInstance('spin',arguments);
};
TimelineLite.prototype.fade = function(){
	return this.zigInstance('fade',arguments);
};
TimelineLite.prototype.fly = function(){
	return this.zigInstance('fly',arguments);
};



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
		},	

		plop:{
			options:{
				_speed:1,
				_density:.9,
				_scale:1,
				_startY:'none',
				_origin:'50% 100%', // ground

				_repeat:0
			},
			animation:function(actor,o,d){

				var q = new TimelineLite();
				// Your custom setting modifications		
				var s=[o._speed/7,o._speed/4];
				var f = 0;
				for(var i in s){ f += s[i]; };
				s[2] = o._speed%f;

				// ----------------------------------------
				// Assign animation to q (timeline)
				// ----------------------------------------

				var sY;
				if(o._startY === 'none'){
					sY = o._parentY-(o._selfY+o._self.data._height);
				}else{
					sY = o._startY;
				}

				console.log(o._parentY-o._selfY);

				q.add(
					TweenLite.set(actor,{
						y:sY
					})
				)

				q.add(
					TweenLite.to(actor,s[0],{
						delay:d,
						opacity:1,
						y:0,
						scaleX:o._scale*o._density,
						scaleY:o._scale/o._density,
						transformOrigin:o._origin,
						ease:'linear'
					})
				);

				q.add(
					TweenLite.to(actor,s[1],{
						opacity:1,
						scaleX:o._scale/o._density,
						scaleY:o._scale*o._density,
						transformOrigin:o._origin,
						ease:'easeOut'
					})
				);

				q.add(
					TweenLite.to(actor,s[2],{
						opacity:1,
						scaleX:o._scale,
						scaleY:o._scale,
						transformOrigin:o._origin,
						ease:'easeOut'
					})
				);


				return q;
			}
		},	

		spin:{
			options:{
				_speed:1, 
				_startY:3,
				_density:.9,
				_scale:1,
				_rotation:360,
				_origin:'50% 50%', // ground

				_repeat:0
			},
			animation:function(actor,o,d){

				var q = new TimelineLite();
				// Your custom setting modifications

				// ----------------------------------------
				// Assign animation to q (timeline)
				// ----------------------------------------

				q.add(
					TweenLite.to(actor,o._speed,{
						delay:d,
						rotation:"+="+o._rotation,
						transformOrigin:o._origin,
						ease:'linear'
					})
				);

				q.add(
					TweenLite.to(actor,0,{
						rotation:'-='+o._rotation
					})
				);


				return q;
			}
		},

		fade:{
			options:{
				_speed:1, 
				_start:0,
				_end:1,
				_origin:'50% 50%', // ground

				_repeat:0
			},
			animation:function(actor,o,d){

				var q = new TimelineLite();
				// Your custom setting modifications

				// ----------------------------------------
				// Assign animation to q (timeline)
				// ----------------------------------------

				q.add(
					TweenLite.set(actor,{
						opacity:o._start,
					})
				);

				q.add(
					TweenLite.to(actor,o._speed,{
						opacity:o._end,
						ease:'easeOut'
					})
				);


				return q;
			}
		},

		fly:{
			options:{

				_speed:1, 
				
				
					_startx:-300,
					_starty:100,
					_startz:300,
					_startrotationx:-90,
					_startrotationy:90,
					_startrotationz:90,
					_startopacity:0,
				

					_endx:0,
					_endy:0,
					_endz:0,
					_endrotationx:0,
					_endrotationy:0,
					_endrotationz:0,
					_endopacity:1,
				

				_origin:'50% 50%', // ground
				_ease:'easeOut',
				_repeat:0
			},
			animation:function(actor,o,d){

				var q = new TimelineLite();
				//q.immediateRender = false;
				// Your custom setting modifications

				// ----------------------------------------
				// Assign animation to q (timeline)
				// ----------------------------------------
				q.add(
					TweenLite.set(actor,{transformPerspective:500,opacity:0})
					);

				q.add(
					TweenLite.fromTo(actor,o._speed,
					{
						x:o._startx,
						y:o._starty,
						z:o._startz,
						opacity:o._startopacity,
						rotationX:o._startrotationx,
						rotationY:o._startrotationy,
						rotationZ:o._startrotationz,
						_origin:o._origin,
						_ease:o._ease
					},
					{
						x:o._endx,
						y:o._endy,
						z:o._endz,
						opacity:o._endopacity,
						rotationX:o._endrotationx,
						rotationY:o._endrotationy,
						rotationZ:o._endrotationz,
						_origin:o._origin,
						_ease:o._ease
					})
				);


				return q;
			}
		}				
};
