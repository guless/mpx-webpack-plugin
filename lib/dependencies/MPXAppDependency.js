const Dependency = require("webpack/lib/Dependency");

module.exports = class MPXAppDependency extends Dependency {
    constructor( dependencies, name ) {
        super();
        this.dependencies = dependencies;
        this.name = name;
    }
    
    get type() {
        return "mpx app";
    }
}