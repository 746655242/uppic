# uppic
移动端图片裁剪解决方案，生成base64文件

#使用说明
js直接调用,文件名：indexjs.html

移动端一定加上 viewport 这一句，不然截图会出错.
```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>移动端上传图片，生成base64文件插件--js</title>

<meta name="viewport" content="initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,width=device-width, user-scalable=no, minimal-ui">
<link href="css/user.css" rel="stylesheet">

</head>

<body>

<h1>js执行调用</h1>
<div class="pic">
    <input class="uppic" id="uppic" type="file">
    <img id="picinfo" src="img/b-pic.png">
</div>
<script src="js/jquery.js"></script>
<script src="js/hammer.js"></script>
<script src="js/exif.js"></script>
<script src="js/uppicjs.js"></script>
<script>
$(function(){
	$('#uppic').change(function(){
		var Up= new uppic();
		Up.init(this.files[0],fn,{'width':250,'height':250}); //参数（上传文件files对象，回调函数，json，设置图片长宽高，目前只能截取正方形）
		function fn(data){
			$('#picinfo').attr('src',data);						
		}
	});
})
</script>

</body>
</html>

```

require模块调用,文件名：index-Modul.html

```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>移动端上传图插件</title>
<meta name="viewport" content="initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,width=device-width, user-scalable=no, minimal-ui">
<link href="css/user.css" rel="stylesheet">
<script src="js/require.js" data-main="js/user.js"></script>
</head>

<body>
<h1>require模块调用</h1>
<div class="pic">
    <input class="uppic" id="uppic" type="file">
    <img id="picinfo" src="img/b-pic.png">
</div>
</body>
</html>

```
#demo地址
js直接调用:http://h.hemaj.com/html/Plugin/uppic/indexjs.html

require模块调用:http://h.hemaj.com/html/Plugin/uppic/index-Modul.html
