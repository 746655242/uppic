require(['jquery','uppic'],function($,Up){
	$('#uppic').change(function(){
		Up.init(this.files[0],fn,{'width':250,'height':250});
		function fn(data){
			$('#picinfo').attr('src',data);						
		}
	});
});