const MultiModule = require("webpack/lib/MultiModule");

module.exports = class MPXMultiModule extends MultiModule {
    constructor({ context, name, request, userRequest, metadata, dependencies }) {
		super(context, dependencies, name);
		this.request = request;
		this.metadata = metadata;
	}

	identifier() {
		return `miniprogram multi module ` + this.request + ` of ${this.dependencies.map(d => d.request).join(" ")}`;
	}
	
	readableIdentifier( requestShortener ) {
		return `miniprogram multi module ` + requestShortener.shorten(this.request) + ` of ${this.dependencies.map(d => requestShortener.shorten(d.request)).join(" ")}`;
	}
}