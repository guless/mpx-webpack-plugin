const Dependency = require("webpack/lib/Dependency");

module.exports = class MPXPageDependency extends Dependency {
    constructor( dependencies ) {
        super();
        this.dependencies = dependencies;
    }
    
    get type() {
        return "mpx page";
    }
}