const path = require("path");

module.exports = function getRelativePath( request, context, outputNodeModules = "node_modules" ) {
    const relative = path.relative(context, request);
    const parts = relative.split(/[\/\\]/);
    
    while( (parts[0] === "." || parts[0] === "..") ) {
        parts.shift();
    }
    
    if ( parts[0] == "node_modules" ) {
        parts[0] = outputNodeModules;
    }
    
    return parts.filter(Boolean).join("/");
    
}