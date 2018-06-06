const MPXMetaData = require("./MPXMetaData");
const MPXMetaDataType = require("./MPXMetaDataType");

module.exports = class MPXPageMetaData extends MPXMetaData {
    constructor() {
        super(MPXMetaDataType.PAGE);
    }
}