(function( context ) { if ( context && context["webpackJsonp"] ) { context["webpackJsonp"]([1],{

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

/* extracted miniprogram json => "index" */
/* {
    "usingComponents": {
        "custom": "../components/custom",
        "plugin": "plugin://PLUGIN_NAME/PLUGIN_PAGE"
    }
} */

/***/ }),

/***/ 16:
/***/ (function(module, exports) {

module.exports = "./index.wxss";

/***/ }),

/***/ 17:
/***/ (function(module, exports) {

module.exports = "./index.wxml";

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(16);
module.exports = __webpack_require__(17);


/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(6);
console.log("enter index");

Page({
   onLoad() {
       console.log("invoke index.onload")
   }
});

/***/ })

},[8])}})((typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this) || (new Function("return this"))());