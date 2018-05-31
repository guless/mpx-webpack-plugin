const MultiEntryDependency = require("webpack/lib/dependencies/MultiEntryDependency");
const SingleEntryDependency = require("webpack/lib/dependencies/SingleEntryDependency");
const MultiModuleFactory = require("webpack/lib/MultiModuleFactory");
const MPXEntryDependency = require("./dependencies/MPXEntryDependency");
const MultiEntryPlugin = require("webpack/lib/MultiEntryPlugin");
const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");

const PLUGIN_NAME = "MPXDynamicEntryPlugin";

module.exports = class MPXDynamicEntryPlugin {
    constructor( context, name, entry ) {
        this.context = context;
        this.name = name;
        this.entry = entry;
    }
    
    apply( compiler ) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, ( compilation,
                                                    { normalModuleFactory, miniprogramModuleFactory } ) => { 
            /// 注册 webpack 其他类型入口点工厂。
            const multiModuleFactory = new MultiModuleFactory();
            
            compilation.dependencyFactories.set(MultiEntryDependency , multiModuleFactory );
            compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory);
            
            /// 注册小程序模块工厂。
            compilation.dependencyFactories.set(MPXEntryDependency, miniprogramModuleFactory);
        });
        
        compiler.hooks.make.tapAsync(PLUGIN_NAME, ( compilation, callback ) => {
            Promise.resolve(this.entry()).then(( entry ) => {
                if ( typeof entry == "string" || Array.isArray(entry) ) {
                    const dependency = new MPXEntryDependency(this.name, this.entry);
                    
                    /// 添加 App 入口点。
                    compilation.addEntry(this.context, dependency, this.name, callback);
                }
                
                else if ( typeof entry == "object" ) {
                    if ( !(this.name in entry) ) {
                        throw new Error(`没有找到名为 "${this.name}" 的小程序入口点。`);
                    }
                    
                    /// 添加 App 入口点。
                    const dependencies = [{ "name": this.name, "dependency": new MPXEntryDependency(this.name, entry[this.name]) }];
                    delete entry[this.name];
                    
                    Object.keys(entry).forEach(( name ) => {
                        if ( Array.isArray(entry[name]) ) {
                            dependencies.push({ 
                                "name": name, 
                                "dependency": MultiEntryPlugin.createDependency(entry[name], name) 
                            });
                        }
                        
                        else {
                            dependencies.push({ 
                                "name": name, 
                                "dependency": SingleEntryPlugin.createDependency(entry[name], name) 
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
                    
                    .then(() => callback(), callback);
                }
            })
        });
    }
}