const MultiEntryDependency = require("webpack/lib/dependencies/MultiEntryDependency");
const SingleEntryDependency = require("webpack/lib/dependencies/SingleEntryDependency");
const MultiModuleFactory = require("webpack/lib/MultiModuleFactory");
const MPXAppDependency = require("./dependencies/MPXAppDependency");
const MultiEntryPlugin = require("webpack/lib/MultiEntryPlugin");
const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");

const PLUGIN_NAME = "MPXDynamicEntryPlugin";

module.exports = class MPXDynamicEntryPlugin {
    constructor( context, name, entries ) {
        this.context = context;
        this.name = name;
        this.entries = entries;
    }
    
    apply( compiler ) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, ( compilation,
                                                    { normalModuleFactory, mpxModuleFactory } ) => { 
            /// 注册 webpack 其他类型入口点工厂。
            const multiModuleFactory = new MultiModuleFactory();
            
            compilation.dependencyFactories.set(MultiEntryDependency , multiModuleFactory );
            compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory);
            
            /// 注册小程序模块工厂。
            compilation.dependencyFactories.set(MPXAppDependency, mpxModuleFactory);
        });
        
        compiler.hooks.make.tapAsync(PLUGIN_NAME, ( compilation, callback ) => {
            Promise.resolve(this.entries()).then(( entries ) => {
                /**
                 * 1) 字符串/数组入口点模式。
                 *    {
                 *        "entry": "./src/app",
                 *        "entry": ["./src/app"]
                 *    }
                 * 
                 * 2) 字典(Object)入口点模式。
                 *    {
                 *        "entry": { "app": "./src/app" }
                 *    }
                 */
                if ( typeof entries == "string" || Array.isArray(entries) ) { /*< 1 >*/
                    const dependency = new MPXAppDependency(this.name, this.entries);
                    
                    /// 添加 App 入口点。
                    compilation.addEntry(this.context, dependency, this.name, callback);
                }
                
                else if ( typeof entries == "object" ) { /*< 2 >*/
                    if ( !(this.name in entries) ) {
                        throw new Error(`没有找到名为 "${this.name}" 的入口点：entry=${JSON.stringify(entries)}`);
                    }
                    
                    /// 添加 App 入口点。
                    const dependencies = [{ "name": this.name, "dependency": new MPXAppDependency(this.name, entries[this.name]) }];
                    delete entries[this.name];
                    
                    Object.keys(entries).forEach(( name ) => {
                        if ( Array.isArray(entries[name]) ) {
                            dependencies.push({ 
                                "name": name, 
                                "dependency": MultiEntryPlugin.createDependency(entries[name], name) 
                            });
                        }
                        
                        else {
                            dependencies.push({ 
                                "name": name, 
                                "dependency": SingleEntryPlugin.createDependency(entries[name], name) 
                            });
                        }
                    });
                    
                    Promise.all(
                        dependencies.map(( data ) => {
                            return new Promise(( resolve, reject ) => {
                                compilation.addEntry(this.context, data.dependency, data.name, err => err ? reject(err) : resolve());
                            });
                        })
                    )
                    
                    .then(() => callback, callback);
                }
            })
        });
    }
}