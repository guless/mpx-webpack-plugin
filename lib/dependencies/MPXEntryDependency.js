const ModuleDependency = require("webpack/lib/dependencies/ModuleDependency");

module.exports = class MPXEntryDependency extends ModuleDependency {
    constructor( request, name ) {
        super(request);
        this.name = name;
        
        if ( typeof this.request != "string" ) {
            throw new Error("小程序的入口点只能使用 string 类型。");
        }
    }
    
    get type() {
        return "miniprogram entry";
    }
}