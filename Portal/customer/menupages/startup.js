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
	    _load_single_file(_p, _load_control);
	} else {
	    if(_al){
		_al();
	    }
	}
    }
    _load_control();

}
function load_db(images, callback){
    /**
     * 加载数据库中的资源文件进来
     * 
     */
    var sql = "select data, pageid from smart_menu where page='system' ";
    SMART_DB.initial();
    var res_store = {};
    SMART_DB.run_sql(sql, [], function(trans, results){
	for(var i = 0; i < results.rows.length; i++){
	    var row = results.rows.item(i);
	    res_store[row.pageid] = row.data;
	}
	if(typeof callback == 'function'){
	    callback(res_store);
	}
    }, function(trans, error){
	return true;
    });
}


function loadcss(file){
    var _load_single_file = function(p){
	var head = document.getElementsByTagName('head').item(0);
	css = document.createElement('link');
	css.href = _G_CSS_BASE + p +".css";
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

