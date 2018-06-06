const ModuleDependency = require("webpack/lib/dependencies/ModuleDependency");

module.exports = class MPXSingleEntryDependency extends ModuleDependency {
	constructor( request, loc, metadata ) {
		super(request);
		this.loc = loc;
		this.metadata = metadata;
	}

	get type() {
		return "miniprogram single entry";
	}
}
