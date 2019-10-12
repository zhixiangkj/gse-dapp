cordova.define("cordova-plugin-gsewallet.GseWallet", function(require, exports, module) {
  var exec = require('cordova/exec');

  // gse钱包支付功能
  exports.pay = function (params, success, error) {
    exec(success, error, 'GseWallet', 'pay', [JSON.stringify(params)])
  };
  // 关闭访问本网页的浏览器
  exports.closeWebView = function (arg0, success, error) {
    exec(success, error, 'GseWallet', 'closeWebView', [arg0]);
  };
  // 定位服务用户是否授权
  exports.isLocationAuthorized = function (arg0, success, error) {
    exec(success, error, 'GseWallet', 'isLocationAuthorized', [arg0]);
  };
  // 保存ofo订单，如果订单已经存在，就更新订单 {status: 订单状态，0:骑行中，1:骑行结束未支付，2:已支付}
  exports.saveOfoOrder = function (params, success, error) {
    exec(success, error, 'GseWallet', 'saveOfoOrder', [JSON.stringify(params)])
  };
});

