define(['jquery','hammer','exif'],function($,Hammer,E){
	return{
		init:function(data,src,options){
			var _this=this;
			var config={
				'width':200,
				'height':200
			};
			if(!data){
				return false;
			}
			options= $.extend({},config,options);//合并事件		
			_this.options=options;
			_this.transform={'scale':1,'x':0,'y':0};//默认
			_this.width=$(window).width();
			var Mtop=_this.width/2;
			
			$(window).resize(function(){
				_this.sizeimg();
			});	
						
			var html='<div id="uppicBox" style="display: block;"><div class="imageBox"><div class="thumbBox box" style="height:'+_this.width+'px;margin-top:-'+Mtop+'px"></div></div><div class="bottom"><span id="clsoe">取消</span><span id="imagebtn" class="fr">选取</span></div></div>';
			$('body').append(html);	
			
			var fileReader = new FileReader();
			fileReader.onloadend=function(e){
				_this.imgsrc=e.target.result;
				var html='<img id="pic-img" src="'+_this.imgsrc+'">';
				$('.imageBox').prepend(html);
				//设置图片垂直居中	
				$('#pic-img').load(function(){				
					_this.imgYh=$('#pic-img').height();
					_this.imgYw=$('#pic-img').width();
					
					_this.sizeimg();
					_this.image=$('#pic-img');				
					_this.oimg=$('.imageBox');
					
					
					var mc=new Hammer.Manager(document.getElementById("uppicBox"));
					mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
					mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
					mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
					mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
					mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
					mc.add(new Hammer.Tap());
						
					
					window._this=_this;//为兼容pc
					//_this.oimg.on('touchstart',{'fn':_this},_this.touchTU);//手指接触事件
					mc.on("doubletap",_this.ondoubletap);
					mc.on("pinchstart pinchmove",_this.onpinchin);
					mc.on("panstart panmove",_this.onPan);
					mc.on('panend',_this.onpanend);
					//console.log(mc);
				});
							
				$('#imagebtn').on('click',function(){//选取
					var data;
					_this.context(function(imgdata){
						data=imgdata;		
						_this.removehtml();
						src(data);
					});
				});
				$("#clsoe").on('click',function(){
					_this.removehtml();
				})
				
			}
			fileReader.readAsDataURL(data);	
		},
		onpanend:function(){//手离开事件
			var scale=_this.transform['scale'];
			var tx=_this.transform['x'];
			var ty=_this.transform['y'];

			var w=_this.imgw*scale;
			var h=_this.imgh*scale;
			var ww=_this.width;
			
			
			var left=(w-ww)/2;
			var right=(ww-w)/2;
			var top=(h-ww)/2;
			var bottom=(ww-h)/2;
			
			if(scale<1){//不满一屏
				scale=1;	
				if(h>w){tx=0}else{ty=0;}
			}else{
				if(tx>left){
					tx=left;
					console.log('过left底线');
				}else if(tx<right){
					tx=right;
					console.log('过right底线');
				}
				if(ty>top){
					ty=top;
					console.log('过top底线');
				}else if(ty<bottom){
					ty=bottom;
					console.log('过bottom底线');
				}			
			}			
			_this.transform['scale']=scale;
			_this.transform['x']=tx;
			_this.transform['y']=ty;

			_this.updateElementTransform();				
		},
		onPan:function(ev){//拖动事件
			if(ev.type == 'panstart') {
				x=_this.transform['x']||0;
				y=_this.transform['y']||0;
			}		
			_this.transform['x']=x+ev.deltaX;
			_this.transform['y']=y+ev.deltaY;
			_this.updateElementTransform();
		},
		onpinchin:function(ev){//缩放事件
				if(ev.type == 'pinchstart') {
					initScale = _this.transform.scale || 1;
				}				
				var scale=initScale*ev.scale;
				if(scale<3){//当放大3倍不许放大
					_this.transform['scale']=scale;	
				}
				_this.updateElementTransform();	
		},
		ondoubletap:function(ev){//放大事件
			if(_this.transform.scale<3){//不许放3倍		
				var scale=_this.transform.scale*1.4;
				_this.transform['scale']=scale;			
				_this.updateElementTransform();
			}else{
				alert('图片再放大失真！');
			}
		},
		updateElementTransform:function(){//动作执行
			 var oimg=document.getElementById('pic-img');		
			 var value = [
				'translate3d(' + _this.transform.x + 'px, ' + _this.transform.y + 'px, 0)',
				'scale(' + _this.transform.scale + ', ' + _this.transform.scale + ')',
			 ];
			value = value.join(" ");
			oimg.style.webkitTransform = value;
			oimg.style.mozTransform = value;
			oimg.style.transform = value;
		},
		sizeimg:function(){
				var w=$(window).width();
				var h=$(window).height();
				var Width=Math.min(w,h);
				this.width=Width;				
				if(h<w){
					$('.thumbBox').css({'width':Width+'px','height':Width+'px','top':'0px','left':'50%','margin-left':0-Width/2+'px','margin-top':0});
					
				}else{
					$('.thumbBox').css({'width':Width+'px','height':Width+'px','top':'50%','left':'0','margin-left':0,'margin-top':0-Width/2+'px'});
				}
								
				if(this.imgYh>=this.imgYw){
					$('#pic-img').css({'width':Width+'px'});
				}else{
					$('#pic-img').css({'height':Width+'px'});
				}
				this.imgh=$('#pic-img').height();
				this.imgw=$('#pic-img').width();
				$('#pic-img').css({'margin-left':this.imgw/-2+'px','margin-top':(this.imgh/-2)+'px'});
		},
		removehtml:function(){
			$('#uppicBox').remove();
		},
		touchTU:function(evt){
				_this=evt.data.fn;
				var touch = evt.originalEvent.touches[0]; //获取第一个触点
				_this.x = Number(touch.pageX);
				_this.y=Number(touch.pageY);			
		},
		context:function(imgdata){
			var image=document.getElementById("pic-img");			
			var canvas = document.createElement("canvas");
			//缩放值 
			var scale=_this.transform['scale'];
			var tx=_this.transform['x'];
			var ty=_this.transform['y'];
	
			var w=0;
			var margintop=(this.imgh*scale-this.width)/2;
			var marginleft=(this.imgw*scale-this.width)/2;
			var bili=this.imgYh/(this.imgh*scale);
			
			if(this.imgYh>this.imgYw){
				w=this.imgYw;
			}else{
				w=this.imgYh;
			}
			var sw=w/scale;
			var sh=w/scale; 
			var sx=(marginleft-tx)*bili;
			var sy=(margintop-ty)*bili;
			var dw=this.options['width'];//设置高
			var dh=this.options['width'];//设置高
			canvas.width = dw;//设置canvas宽
            canvas.height = dh;//设置canvas宽
			
			var context = canvas.getContext("2d");
			
			var Orientation;
			EXIF.getData(image, function(){
			  Orientation=EXIF.getTag(this, 'Orientation');
			});		
			
			if(Orientation>1){
				_this.drawPhoto(image,Orientation,function(html,shuoxiao){
					$('body').append(html);
					var oimg=document.getElementById("piciphone");
					oimg.onload=function(){				
						context.drawImage(this,sx/shuoxiao,sy/shuoxiao,sw/shuoxiao,sw/shuoxiao,0,0,dw,dh);//向画布上绘制图像
						var imageData = canvas.toDataURL('image/jpg');//设置格式  
						imgdata(imageData);
					}		
				});
				
			}else{
				context.drawImage(image,sx,sy,sw,sw,0,0,dw,dh);//向画布上绘制图像
				var imageData = canvas.toDataURL('image/jpg');//设置格式  
				imgdata(imageData);
			}
			
		},
		drawPhoto:function(img,dir,next){
			 var image=new Image();
			 image.onload=function(){
				  var degree=0,drawWidth,drawHeight,width,height,shuoxiao;
				  drawWidth=this.naturalWidth;
				  drawHeight=this.naturalHeight;
				  //以下改变一下图片大小
				  var maxSide = Math.max(drawWidth, drawHeight);
				  if (maxSide > 1024) {
					var minSide = Math.min(drawWidth, drawHeight);
					shuoxiao=maxSide/1024;
					minSide = minSide / maxSide * 1024;
					maxSide = 1024;
					if (drawWidth > drawHeight) {
					  drawWidth = maxSide;
					  drawHeight = minSide;
					} else {
					  drawWidth = minSide;
					  drawHeight = maxSide;
					}
				  }
					
				
				var canvas = document.createElement("canvas");
				canvas.width=width=drawWidth;
			    canvas.height=height=drawHeight; 
			    var context=canvas.getContext('2d');
				switch(dir){
				//iphone横屏拍摄，此时home键在左侧
				case 3:
				  degree=180;
				  drawWidth=-width;
				  drawHeight=-height;
				  break;
				//iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
				case 6:
				  canvas.width=height;
				  canvas.height=width; 
				  degree=90;
				  drawWidth=width;
				  drawHeight=-height;
				  break;
				//iphone竖屏拍摄，此时home键在上方
				case 8:
				  canvas.width=height;
				  canvas.height=width; 
				  degree=270;
				  drawWidth=-width;
				  drawHeight=height;
				  break;
			  }
			  
			//使用canvas旋转校正
			  context.rotate(degree*Math.PI/180);
			  context.drawImage(this,0,0,drawWidth,drawHeight);			
				var imageData = canvas.toDataURL('image/jpg');//设置格式  
				var html='<img id="piciphone" style="display:none"  width="100%" src="'+imageData+'"/>';
				next(html,shuoxiao);
			}	
			image.src=img.src;		
		}
	}
});