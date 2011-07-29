var SMARTMENU_MENU = function() {
    this.initialize = function(config) {
	self = this;
	var lang = 'cn';
	var nav_handdler = 'nav_hidden';
	var nav_pos_id = 'nav_position';
	if(config){
	    lang = config["lang"] || 'cn';
	    nav_handdler = config.nav_id || 'nav_hidden';
	    nav_pos_id = config.nav_pos_id || 'nav_position';
	}
	self.lang = lang
	self.nav_handdler = nav_handdler
	self.nav_position = nav_pos_id;
	/**
	 * 添加点击事件
	 * 
	 */
	new webkit_click(self.nav_handdler, {onClick : function(){
	    self.show_cate_change();
	}});
	/// 添加描述字符串.将根据给定的语言来初始化 .
	$("#" + self.nav_position).text(SMARTMENU_NOTI[self.lang]['restaurant_suggest'] + " > " + SMARTMENU_NOTI[self.lang]['restaurant_top']);
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
$(document).ready(function(){
    var _G_menu = new SMARTMENU_MENU();
    _G_menu.initialize();
});