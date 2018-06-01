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
            console.log("search:", request.path);
            
            fs.stat(dirname, ( err, stat ) => {
                if ( err ) return callback(err);
                if ( !stat || !stat.isDirectory() ) return callback(new Error(dirname + " doesn't exist or is not a directory"));
                const name = this.removeExtension(basename);
                
                fs.readdir(dirname, ( err, files ) => {
                    files = this.excludeOtherNames (files, name);
                    files = this.excludeRepeatNames(files, this.platform);
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
    
    excludeRepeatNames( files, platform ) {
        const maps = new Map();
        
        files.forEach(item => {
            const parts = item.split(".");
            const extname = parts[parts.length - 1];
            
            /// 优先级顺序：
            ///   "app.{platform}.js" > "app.js" > "app.{others}.js"
            let priority = 0;
            
            if ( parts.length === 2 ) {
                priority = 2;
            }
            
            else if ( parts.length === 3 && parts[1] === platform ) {
                priority = 3;
            }
            
            else {
                priority = 1;
            }
            
            if ( maps.has(extname) ) {
                const last = maps.get(extname);
                
                if ( priority > last.priority ) {
                    maps.set(extname, { "priority": priority, "value": item });
                }
            }
            
            else {
                maps.set(extname, { "priority": priority, "value": item });
            }
        });
        
        return Array.from(maps.values()).map(item => item.value);
    }
}