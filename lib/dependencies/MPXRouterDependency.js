const Dependency = require("webpack/lib/Dependency");

module.exports = class MPXRouterDependency extends Dependency {
    constructor( pages ) {
        super();
        this.pages = pages;
    }
    
    get type() {
        return "mpx router";
    }
}