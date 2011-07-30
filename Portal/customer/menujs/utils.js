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
