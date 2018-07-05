/*! MPX_LOAD_CHUNKS_PLUGIN CHUNKS INJECTION */
require("./runtime");
require("./verdors");

(function( context ) { if ( context && context["webpackJsonp"] ) { context["webpackJsonp"]([0],{

/***/ 17:
/***/ (function(module, exports) {

module.exports = "./app.wxss";

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(3);
__webpack_require__(6);
module.exports = __webpack_require__(17);


/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
console.log("enter app");

App({
    onLaunch() {
        console.log("invoke app onlaunch");
    }
});

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

/*! extracted miniprogram json: "app" */
/* {
    "pages": [
        "pages/index",
        "pages/discover"
    ],
    "tabBar": {
        "list": [
            {
                "pagePath": "pages/index",
                "iconPath": "/assets/tabbar/ticket_4bf11d.png",
                "selectedIconPath": "/assets/tabbar/ticket-selected_0f45a3.png"
            },
            {
                "pagePath": "pages/discover",
                "iconPath": "/assets/tabbar/ticket_4bf11d.png",
                "selectedIconPath": "/assets/tabbar/ticket-selected_0f45a3.png"
            }
        ]
    }
} */

/***/ })

},[2])}})((typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this) || (new Function("return this"))());;