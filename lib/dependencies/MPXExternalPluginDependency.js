const ModuleDependency = require("webpack/lib/dependencies/ModuleDependency");

module.exports = class MPXExternalPluginDependency extends ModuleDependency {
    constructor( request, metadata ) {
        super(request);
        this.metadata = metadata;
        
        if ( typeof this.request != "string" ) {
            throw new Error("小程序的入口点只能使用 string 类型。");
        }
    }
    
    get type() {
        return "miniprogram external plugin";
    }
}