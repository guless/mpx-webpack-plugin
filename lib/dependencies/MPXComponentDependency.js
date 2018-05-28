const Dependency = require("webpack/lib/Dependency");

module.exports = class MPXComponentDependency extends Dependency {
    constructor( dependencies ) {
        super();
        this.dependencies = dependencies;
    }
    
    get type() {
        return "mpx component";
    }
}