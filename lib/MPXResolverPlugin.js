const path = require("path");

const PLUGIN_NAME = "MPXResolverPlugin";

module.exports = class MPXResolverPlugin {
    constructor( source, platform, target ) {
        this.source = source;
        this.target = target;
        this.platform = platform;
    }
    
    apply( resolver ) {
        const source = resolver.getHook(this.source);
        const target = resolver.ensureHook(this.target);
        
        source.tapAsync(PLUGIN_NAME, ( request, resolveContext, callback ) => {
            const dirname = path.dirname(request.path);
            const basename = path.basename(request.path);
            const fs = resolver.fileSystem;
            
            fs.stat(dirname, ( err, stat ) => {
                if ( err ) return callback(err);
                if ( !stat || !stat.isDirectory() ) return callback(new Error(dirname + " doesn't exist or is not a directory"));
                const name = this.removeExtension(basename);
                
                fs.readdir(dirname, ( err, files ) => {
                    files = this.excludeOtherNames    (files, name);
                    files = this.excludeOtherPlatforms(files, this.platform);
                    files = files.map(item => path.join(dirname, item));
                    
                    if ( !files.length ) {
                        return callback(new Error(request.path + " doesn't match any files"));
                    }
                    
                    const obj = Object.assign({}, request, { "files": files });
                    resolver.doResolve(target, obj, null, resolveContext, callback);
                });
            });
        });
    }
    
    removeExtension( basename ) {
        let extname = null;
        
        while( extname = path.extname(basename) ) {
            basename = basename.slice(0, basename.length - extname.length);
        }
        
        return basename;
    }
    
    excludeOtherNames( files, name ) {
        return files.filter(item => (item.indexOf(name + ".") === 0)); // 忽略其他名称的文件。
    }
    
    excludeOtherPlatforms( files, platform ) {
        const dict = new Map();
        
        files.forEach(item => {
            const parts = item.split(".");
            
            /// "app.js"
            if ( parts.length === 2 ) {
                const name = parts[1];
                
                if ( !dict.has(name) ) {
                    dict.set(name, item);
                }
            }
            
            /// "app.{platform}.js"
            else if ( parts.length === 3 ) {
                const plat = parts[1];
                const name = parts[2];
                
                if ( plat === platform ) {
                    dict.set(name, item);
                }
            }
        });
        
        return Array.from(dict.values());
    }
}