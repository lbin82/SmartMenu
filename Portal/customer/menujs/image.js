/**
 * @file   image.js
 * @author alvayang <alvayang@sohu-inc.com>
 * @date   Wed Jul 20 22:59:59 2011
 * 
 * @brief  图形操作库,主要用于将图片序列化和反向序列化.
 * 
 * 
 */


var SMART_IMAGE = {
    _support_test : function(){
	var canvas = document.getElementById('debug');
	if(!canvas) return false;
	return canvas.toDataURL !== undefined;
    },

    /** 
     * 根据给定的imageid来返回序列化之后的值
     * 
     * @param imageid 
     * 
     * @return 序列化的图片
     */
    serializeCanvasByID : function(imageid) {
        var canvas = document.getElementById(picID);
        var serializedVal = 'data:,';
        if (canvas.toDataURL) serializedVal = canvas.toDataURL();
        return serializedVal;
    },

    /** 
     * 将给定的data画到给定的canvas中去.
     * 
     * @param data 
     * @param canvas 
     * 
     * @return 
     */
    drawImageOnCanvas : function(data, canvas) {
	if(!this._support_test()) return -1;
        var img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0);
        };
        img.src = data;
    }
}