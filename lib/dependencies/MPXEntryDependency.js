const Dependency = require("webpack/lib/Dependency");

module.exports = class MPXEntryDependency extends Dependency {
    constructor( name, request ) {
        super();
        this.name = name;
        this.request = request;
        
        if ( typeof this.request != "string" ) {
            throw new Error("小程序的入口点只能使用 string 类型。");
        }
    }
    
    get type() {
        return "miniprogram entry";
    }
}