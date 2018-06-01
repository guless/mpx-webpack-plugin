const ModuleDependency = require("webpack/lib/dependencies/ModuleDependency");

module.exports = class MPXSingleEntryDependency extends ModuleDependency {
	constructor(request, loc) {
		super(request);
		this.loc = loc;
	}

	get type() {
		return "miniprogram single entry";
	}
}
