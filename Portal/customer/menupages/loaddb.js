var _G_RES_BASE = "/Portal/customer/";
var _G_JS_BASE = _G_RES_BASE + "menujs/";
var _G_CSS_BASE = _G_RES_BASE + "menucss/";
var _G_IMG_BASE = _G_RES_BASE + "menuimages/";

function show_error(){
    var args = Array.prototype.slice.call(arguments);
    var _info = [];
    var _p = args.shift();
    while(_p){
	if(typeof _p == 'array'){
	    _info.push(_p.toString());
	} else {
	    _info.push(_p);
	}
	_p = args.shift();
    }
    $('#debuginfo').append("<li>" + _info.join(", ") + "</li>");
}

function loadjs(){
    var _load_single_file = function(path, callback){
	/**
	 * 我们不停的检测有没有jQuery对象,如果没有的话,最少jquery这个基础类库没有加载成功,那么我们加载其它的类库可能会惨遭失败.
	 * 
	 */
	var head = document.getElementsByTagName('head').item(0);
	script = document.createElement('script');
	script.src = _G_JS_BASE + path + ".js";
	script.type = 'text/javascript';
	script.id = path;
	head.appendChild(script);
	var check_id = function(){
	    if(callback && path){
		if(!document.getElementById(path)){
		    setTimeout("check_id", 50);
		}else {
		    callback();
		}
	    }
	}
	check_id();
    }
    var lists = Array.prototype.slice.call(arguments);
    var _al = lists.shift();
    /**
     * 第一参数如果是函数,就认为是全局的回调函数,否则就认为要加载的js文件名
     * 
     */
    if(typeof _al !== 'function'){
	lists.unshift(_al);
	_al = null;
    }
    var _load_control = function(){
	var _p = lists.shift();
	if (_p) {
	    console.log("load " + _p);
	    _load_single_file(_p, _load_control);
	} else {
	    if(_al){
		console.log("load callback " );
		_al();
	    }
	}
    }
    _load_control();

}


function loadcss(file){
    var _load_single_file = function(p){
	var head = document.getElementsByTagName('head').item(0);
	css = document.createElement('link');
	css.href = _G_CSS_BASE + file +".css";
	css.rel = 'stylesheet';
	css.type = 'text/css';
	head.appendChild(css);
    }
    var lists = Array.prototype.slice.call(arguments);
    var _p = lists.shift();
    while(_p){
	_load_single_file(_p);
	_p = lists.shift();
    }
}

function loadimages (images) {
    var sql = "create table if not exists smart_menu(id INTEGER primary key AUTOINCREMENT, page TEXT NULL, pageid TEXT NOT NULL, mash TEXT NOT NULL, data TEXT NOT NULL, reserve_1 INTEGER NULL, reserve_2 TEXT NULL);";
    SMART_DB.initial();
    SMART_DB.build_db(sql, [], 0, 0, function(){
	// 创建成功.开始搜索页面上的元素.
	search_elements(images);
    }, function(transaction, error){
	// 表存在也会导致错误.所以这里还是不理睬它了.在写入的时候再做处理吧.
	search_elements(images);
	return true;
    });
}

function search_elements(images){
    function _load_single_file (path, callback) {
	var body = document.body;
	var img = new Image();
	img.onload = function(){
	    try{
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(this, 0, 0);
//		$(body).append("." + path.replace(".", '_').replace("-", "_") + "{background:url(" + canvas.toDataURL() + ") top left no-repeat; height:" + img.height + "px;width:" + img.width + "px;}");
		//window.open(canvas.toDataURL());
		var mash = $.md5(path + Date.now());
		var sql = "insert into smart_menu(page, pageid, mash, data) values (?, ?, ?, ?)";
		var params = [];
		params.push('system');
		params.push(path);
		params.push(mash);
		params.push(canvas.toDataURL());
		SMART_DB.run_sql(sql, params, function(trans, result){
		    show_error("[Success]: " + path);
		}, function(trans, error){
		    show_error("[Failed]: " + error.message);
		});
		callback();
	    }catch(e){
		show_error(e.message);
	    }
	}
	img.src = _G_IMG_BASE + path;
    }
    var lists = Array.prototype.slice.call(images);
    var _al = lists.shift();
    if(typeof _al !== 'function'){
	lists.unshift(_al);
	_al = null;
	
    }
    function _load_control(){
	var _p = lists.shift();
	if(_p){
	    _p = 'test_area/' + _p;
	    show_error("Load: " + _p);
	    _load_single_file(_p, _load_control);
	} else {
	    if(_al){
		_al();
	    }
	}
    }
    _load_control();
}
