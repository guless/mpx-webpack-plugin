const ModuleDependency = require("webpack/lib/dependencies/ModuleDependency");

module.exports = class MPXSingleEntryDependency extends ModuleDependency {
	constructor( request, name, loc, metadata ) {
		super(request);
		this.loc = loc;
		this.name = name;
		this.metadata = metadata;
	}

	get type() {
		return "miniprogram single entry";
	}
}
