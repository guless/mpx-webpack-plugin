const path = require("path");

module.exports = function getTopName( url ) {
    return (path.basename(url).split(".")[0]);
}