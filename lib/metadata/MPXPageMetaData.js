const MPXMetaData = require("./MPXMetaData");
const MPXMetaDataKind = require("./MPXMetaDataKind");

module.exports = class MPXPageMetaData extends MPXMetaData {
    constructor() {
        super(MPXMetaDataKind.PAGE);
    }
}