const { WECHAT, ALIPAY, BAIDU } = require("../platforms");

module.exports = function getInterpolateExtname( ext, platfrom = WECHAT ) {
    switch( ext ) {
        case "html" :
        case "xml"  :
        case "wxml" :
        case "axml" :
        case "swan" :
            if ( platfrom === WECHAT ) { return "wxml"; }
            if ( platfrom === ALIPAY ) { return "axml"; }
            if ( platfrom === BAIDU  ) { return "swan"; }
            return "wxml";
            
        case "css" :
        case "scss":
        case "sass":
        case "wxss":
        case "acss":
            if ( platfrom == WECHAT ) { return "wxss"; }
            if ( platfrom == ALIPAY ) { return "acss"; }
            if ( platfrom == BAIDU  ) { return "css";  }
            return "wxss";
            
        case "js" :
        case "jsx":
        case "ts" :
        case "tsx":
        case "wxs":
            return "js";
    }
    
    return "";
}