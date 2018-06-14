const path = require("path");
const asyncLib = require("neo-async");

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
            const name = this.removeAllExtension(path.basename(request.path));
            const fs = resolver.fileSystem;
            
            console.log("search:", request.path);
            
            /// 删除文件系统缓存
            fs.purge && fs.purge(dirname);
            
            fs.stat(dirname, ( err, stat ) => {
                if ( err ) return callback(err);
                if ( !stat || !stat.isDirectory() ) return callback(new Error(dirname + " doesn't exist or is not a directory"));
                
                fs.readdir(dirname, ( err, files ) => {
                    asyncLib.waterfall([
                        callback => callback(null, files),
                        
                        /// 1) 过滤子目录。
                        this.filterDirectories.bind(this, dirname, fs),
                        
                        /// 2) 过滤其他名称的文件。
                        this.filterNotMatchBaseNames.bind(this, name),
                        
                        /// 3) 根据文件名称进行排序。
                        this.sortFilesPriority.bind(this),
                        
                        /// 4) 过滤相同后缀的文件。
                        this.filterDuplicateExtensions.bind(this)
                    ],
                    
                    ( err, files ) => {
                        if ( err ) return callback(err);
                        
                        const newRequest = Object.assign({}, request, {
                            "miniprogramData": {
                                "name": name,
                                "files": files,
                                "context": dirname
                            }
                        });
                        
                        resolver.doResolve(target, newRequest, null, resolveContext, callback);
                    });
                });
            });
        });
    }
    
    removeAllExtension( filename ) {
        return filename.split(".")[0];
    }
    
    filterDirectories( dirname, fileSystem, files, callback ) {
        asyncLib.filter(files, ( item, callback ) => {
            fileSystem.stat(path.join(dirname, item), ( err, stat ) => callback(err, !stat || stat.isDirectory() ? false : true));
        }, 
        
        callback);
    }
    
    filterNotMatchBaseNames( name, files, callback ) {
        callback(null, files.filter(item => (item.indexOf(name + ".") === 0)));
    }
    
    sortFilesPriority( files, callback ) {
        callback(null, files.sort(this.compareFilesPriority.bind(this)));
    }
    
    compareFilesPriority( a, b ) {
        const a_parts = a.split(".");
        const b_parts = b.split(".");

        if ( a_parts.length === 3 && a_parts[1] === this.platform ) { 
            return -1; 
        }
        
        if ( b_parts.length === 3 && b_parts[1] === this.platform ) { 
            return 1; 
        }
        
        if ( a_parts.length < b_parts.length ) { return -1; }
        if ( b_parts.length < a_parts.length ) { return 1;  }
        
        return 0;
    }
    
    filterDuplicateExtensions( files, callback ) {
        const dict = new Map();
        
        files = files.filter(item => {
            const extname = path.extname(item);
            
            if ( dict.has(extname) ) {
                return false;
            }
            
            dict.set(extname, true);
            return true;
        });
        
        callback(null, files);
    }
}