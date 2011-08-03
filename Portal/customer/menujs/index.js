var SMARTMENU_MENU = function() {
    this.initialize = function(config) {
	self = this;
	var lang = 'cn';
	var nav_handdler = 'nav_hidden';
	var nav_pos_id = 'nav_position';
	var selector_area = 'cate_character';
	var selector_cate = 'cate_selector';
	if(config){
	    lang = config["lang"] || 'cn';
	    nav_handdler = config.nav_id || 'nav_hidden';
	    nav_pos_id = config.nav_pos_id || 'nav_position';
	    selector_area = config.selector_area || 'cate_character';
	    selector_cate = config.selector_cate || 'cate_selector';
	}
	self.lang = lang
	self.nav_handdler = nav_handdler
	self.nav_position = nav_pos_id;
	self.selector_area =  selector_area;
	self.selector_cate = selector_area;
	/**
	 * 添加点击事件
	 * 
	 */
	new webkit_click(self.nav_handdler, {onClick : function(){
	    self.show_cate_change();
	}});
	/// 添加描述字符串.将根据给定的语言来初始化 .
	this.update_nav(['restaurant_suggest', 'dish_top']);
	/// 最大块的描述
	this.update_selector(['dish_top', 'dish_hot', 'dish_suggest']);
	/// 为视图绑定事件
	this.bind_view_type();
    }
    /** 
     * 用于更新菜品分类的右侧提示,
     * 
     * @param lists locale中的key
     * 
     * @return 
     */
    this.update_nav = function(lists){
	var arr_nav = [];
	$.each(lists, function(index, data){
	    try{
		arr_nav.push(SMARTMENU_NOTI[self.lang][data]);
	    }catch(e){}
	});
	$("#" + self.nav_position).text(arr_nav.join(' > '));
    }
    /** 
     * 更新导航下面的分类文字
     * 
     * @param lists 对应的locale中的key
     * 
     * @return 
     */
    this.update_selector = function(lists){
	var arr_nav = [];
	$.each(lists, function(index, data){ 
	    try{
		$("#" + self.selector_area).append("<div class='selector_desc' name='selecotor_" + data + "'>" + SMARTMENU_NOTI[self.lang][data] + "</div>");
	    }catch(e){}
	});
	$("#" + self.selector_area + " :first-child").addClass('selector_selected');
	$.each($("#" + self.selector_area).children(), function(index, val){
	    var o = this;
	    new webkit_click(this, {onClick : function(){
		$.each($("#" + self.selector_area).children(), function(ind, valu){
		    $(this).removeClass('selector_selected');
		});
		$(o).addClass('selector_selected');

	    }});
	});
    }


    this.bind_view_type = function() {
	$.each($('#' + self.selector_cate).children(), function(index, val){
	    var o = this;
	    new webkit_click(this, {onClick : function(){
		alert($(val).attr('name'));
	    }});
	    
	});
    }


    this.show_cate_change = function() {
	try{
	    if($('#' + self.nav_handdler).hasClass('nav-bar-hidden')){
		$("#" + self.nav_handdler).removeClass('nav-bar-hidden').addClass('nav-bar-show');
		$('#' + self.nav_position).addClass('nav-position-bottom');

	    }else{
		$("#" + self.nav_handdler).removeClass('nav-bar-show').addClass('nav-bar-hidden');
		$('#' + self.nav_position).removeClass('nav-position-bottom');

	    }
	}catch(e){
	    alert(e.message);
	}
    }

}

// $(document).ready(function(){
//     var _G_menu = new SMARTMENU_MENU();
//     _G_menu.initialize();
// });


var SMART_MENU_INDEX = function(){
    this.show_loading = function(status){
	$.mobile.pageLoading(status);
    }

    this.show_error = function(){
	console.log(arguments);
    }

    this.load_db = function(images, callback){
	/**
	 * 加载数据库中的资源文件进来
	 * 
	 */
	this.show_loading();
	var sql = "select data, pageid from smart_menu where page='system' ";
	this.res_store = {};
	var self = this;
	
	SMART_DB.initial();
	SMART_DB.run_sql(sql, [], function(trans, results){
	    for(var i = 0; i < results.rows.length; i++){
		var row = results.rows.item(i);
		self.res_store[row.pageid] = row.data;
	    }
	    if(typeof callback == 'function'){
		callback();
	    }
	}, function(trans, error){
	    show_error(error.message);
	    return true;
	});
    }

    this.initialize = function(config) {
	var self = this;
	/**
	 * 加载数据库中的资源文件进来
	 * 
	 */
	// $('body').css({'background-image' : "url(" + res_store.bg-1 + ")"});
    }
    this.draw = function(res){
	/*
	var self = this;
	// add the backgroud
	$('html').css({'background-image' : 'url("' + res['bg-1.png'] + '") !important;'});
	self.show_loading(true);
	// add home menu
	var hi = document.createElement('image');
	hi.src = res['login.png'];
	$('#logo').append(hi);
	// add language menu
	var lm = document.createElement('image');
	lm.src = res['language-1.png'];
	lm.id = 'language-point';
	$('#language').append(lm);

	// add beautiful fonts
	// add logo
	var logom = document.createElement('image');
	logom.src = res['logo.jpg'];
	logom.id = 'logo_jpg';
	$('#product_name').append(logom);
	// 加载三个图标
	var logom = document.createElement('image');
	logom.src = res['button-chef.png'];
	logom.id = 'chef';
	$('#chef').append(logom);

	var logom = document.createElement('image');
	logom.src = res['button-restaurant.png'];
	logom.id = 'restaurant';
	$('#restaurant').append(logom);

	var logom = document.createElement('image');
	logom.src = res['button-menu.png'];
	logom.id = 'menuimg';
	$('#menu').append(logom);

	// 加载参谱图标
	var logom = document.createElement('image');
	logom.src = res['menu-sample.jpg'];
	logom.id = 'c_menu_image';
	$('#c_menu').append(logom);
	$('#c_menu').append("中文餐谱");

	var logom = document.createElement('image');
	logom.src = res['menu-sample.jpg'];
	logom.id = 'e_menu_image';
	$('#e_menu').append(logom);
	$('#e_menu').append("英文菜谱");


	// 绑定按钮事件
*/
	$("body").removeClass('ui-mobile-viewport').addClass('bg-1_png');
    }
}

function firelogic(){
    if(typeof SMART_DB == 'undefined' || typeof jQuery == 'undefined'){
	setTimeout(function(){firelogic();}, 50);
	console.log('reload later');
    } else {
	var _G_INDEX = new SMART_MENU_INDEX();
	_G_INDEX.initialize();
	var sys_want = ['menu-sample.jpg', 'language-1.png', 'language-2.png', 'button-chef.png', 'button-menu.png', 'button-restaurant.png', 'login.png', 'logo.jpg', 'bg-1.png'];
	load_db(sys_want, function(res){
	    /**
	     * 开始绘制图片
	     * 
	     */
	    _G_INDEX.draw(res);
	});
    }
}

$(document).ready(function(){
    $("body").addClass('bg-1_png');
    $("#language_menu").hide();
    $('#menu_chooser').hide();
    $('#language').click(function(){
	$('#language_menu').show();
    });
    var lanc = new webkit_click('language', {onClick : function(){
	$('#language_menu').show();
    }});
    new webkit_click('index-page', {onClick:function(){
	$('#language_menu').hide();
	$('#menu_chooser').hide();
    }});
    new webkit_click('menu_pic', {onClick:function(){
	$('#menu_chooser').show();
	$('#menu_list').show();
    }});
});
