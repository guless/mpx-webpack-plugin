module.exports = function getInterpolateExtname( ext, platfrom = "wechat" ) {
    switch( ext ) {
        case "html" :
        case "xml"  :
        case "wxml" :
        case "axml" :
        case "swan" :
            if ( platfrom == "wechat" ) { return "wxml"; }
            if ( platfrom == "alipay" ) { return "axml"; }
            if ( platfrom == "baidu"  ) { return "swan"; }
            return "wxml";
            
        case "css" :
        case "scss":
        case "sass":
        case "wxss":
        case "acss":
            if ( platfrom == "wechat" ) { return "wxss"; }
            if ( platfrom == "alipay" ) { return "acss"; }
            if ( platfrom == "baidu"  ) { return "css";  }
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