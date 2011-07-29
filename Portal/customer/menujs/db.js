/**
 * @file   db.js
 * @author alvayang <alvayang@sohu-inc.com>
 * @date   Tue Jul 19 23:06:08 2011
 * 
 * @brief  数据库相关的操作.
 * 
 * 
 */

var SMART_DB = {
    /** 
     * 检测当前的浏览器是否支持HTML5 Local Database.
     * Safari 4, iPhone/iPad OS3, Chrome 5, and Opera 10.5 (Desktop) 是支持的.
     * Read More:
     * http://www.webkit.org/blog/126/webkit-does-html5-client-side-database-storage/
     * @return boolean true|false
     */
    _support_test : function() {
	return window.openDatabase !== undefined;
    },

    /** 
     * 初始化
     * 
     * @param config 数据库配置文件.<BR>
     * 目前支持的参数包括:
     *      dbname -- 操作句柄.也叫数据库名
     *      version -- 版本号,本次的版本我们称为"1.5", 
     *      desc  -- 数据库的详细描述
     *      dbsize -- 数据库的体积,如果不指定的话,选择10mb作为起始值,单位是byte,因此需要传入象 10 * 1024 * 1024 这样的值.
     * Ref:
     *      http://developer.apple.com/safari/library/documentation/iPhone/Conceptual/SafariJSDatabaseGuide/UsingtheJavascriptDatabase/UsingtheJavascriptDatabase.html#//apple_ref/doc/uid/TP40007256-CH3-XSW1
     * 
     * @return null nothing return
     */
    initial : function(config) {
	config = config || {};
	this.config =  config;
	this.dbname = this.config.dbname || "SmartMenu";
	this.dbversion = this.config.version || "1.5";
	this.dbdesc = this.config.desc || "The Smart Menu DB";
	this.dbsize = this.config.size || (10 * 1024 * 1024); // bytes
	return this._init_db();
    },

    /** 
     * 初始化数据库,在初始化类时被调用
     * 
     * 
     * @return int 操作结果
     *         -1 不支持数据库
     *         -2 不支持的数据库版本.
     *         -3 打开异常,但是不知道错在哪里了.
     */
    _init_db : function() {
	if(!this._support_test()){
	    return -1;
	}
	try {
	    this.dbhandler = openDatabase(this.dbname, this.dbversion, this.dbdesc, this.dbsize);
	    return 1;
	} catch (e) {
	    return e == INVALID_STATE_ERR ? -2 : -3;
	}
    },

    build_db : function(schema, params, force, clear_table, callback, errback) {
	force = force || 0;
	params = params || [];
	schema = schema || null,
	clear_table = clear_table || null;
	callback = callback || this.nullDataHandler;
	errback = errback || this.killTransaction;

	if (force && clear_table) {
	    this.dbhandler.transaction(function (transaction) {
		    transaction.executeSql('DROP TABLE ?;', [clear_table]);
		});
	}
	this.dbhandler.transaction(function(transaction) {
		transaction.executeSql(schema, params, callback, errback);
	    });
    },

    /** 
     * 执行sql语句
     * 
     * @param sql 等待执行的sql语句.
     * @param params 参数
     * @param callback 执行后的返回值
     * @param errback 错误返回值
     * 
     * @return int 执行结果
     *        -1 sql语句为空
     */
    run_sql : function(sql, params, callback, errback) {
	sql = sql || null;
	params = params || [];
	callback = callback || this.nullDataHandler;
	errback = errback || this.killTransaction;
	if (!sql) {
	    return -1;
	}
	this.dbhandler.transaction(function(transaction) {
		transaction.executeSql(sql, params, callback, errback);
	    });
    },

    /** 
     * 执行一个transaction
     * 
     * @param sqls 要执行的一系列语句
     * @param callback transaction成功的调用
     * @param errback transaction失败的调用
     * 
     * @return int 执行结果
     *         -1 sql语句长度为0
     */
    run_trans : function(sqls, callback, errback){
	sqls = sqls || [];
	callback = callback || this.nullDataHandler;
	errback = errback || this.killTransaction;

	if (!sqls || 0 === sqls.length) {return -1;}
	this.dbhandler.transaction(
	    function(transaction) {
		for (var i = 0; i < sqls.length; i++){
		    transaction.executeSql(sqls[i], []);
		}
	    }, callback, errback);
    },

    /** 
     * 如果不需要返回值的处理函数
     * 
     * @param transaction 
     * @param results 
     * 
     * @return null 没有返回值
     */
    _nullDataHandler :function(transaction, results) {},

    /** 
     * 默认出错的处理函数
     * 
     * @param transaction 
     * @param error 
     * 
     * @return 没有返回值
     */
    killTransaction : function(transaction, error) {
	return true;
    }
}