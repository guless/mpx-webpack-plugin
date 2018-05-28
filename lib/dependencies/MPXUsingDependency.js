const Dependency = require("webpack/lib/Dependency");

module.exports = class MPXUsingDependency extends Dependency {
    constructor( components ) {
        super();
        this.components = components;
    }
    
    get type() {
        return "mpx using";
    }
}