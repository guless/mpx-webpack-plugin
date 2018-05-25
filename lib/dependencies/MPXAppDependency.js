const Dependency = require("webpack/lib/Dependency");

module.exports = class MPXAppDependency extends Dependency {
    constructor( name, entries ) {
        super();
        this.name = name;
        this.entries = entries;
    }
}