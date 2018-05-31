const ModuleDependency = require("webpack/lib/dependencies/ModuleDependency");

module.exports = class MPXUsingDependency extends ModuleDependency {
    constructor( tagname, request, originModule ) {
        super(request);
        this.tagname = tagname;
        this.originModule = originModule;
    }
    
    get type() {
        return "miniprogram using";
    }
}