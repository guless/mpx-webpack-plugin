const MultiModule = require("webpack/lib/MultiModule");

module.exports = class MPXMultiModule extends MultiModule {
    constructor({ context, name, request, userRequest, metadata, dependencies }) {
		super(context, dependencies, name);
		this.request = request;
		this.metadata = metadata;
    }
}