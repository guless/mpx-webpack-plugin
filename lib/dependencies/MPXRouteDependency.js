const ModuleDependency = require("webpack/lib/dependencies/ModuleDependency");

module.exports = class MPXRouteDependency extends ModuleDependency {
    constructor( request, originModule ) {
        super(request);
        this.originModule = originModule;
    }
    
    get type() {
        return "miniprogram route";
    }
}