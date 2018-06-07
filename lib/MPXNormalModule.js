const NormalModule = require("webpack/lib/NormalModule");

module.exports = class MPXNormalModule extends NormalModule {
    constructor( data ) {
        super(data);
        this.metadata = data.metadata;
    }
}