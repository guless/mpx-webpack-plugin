const MPXEntryPlugin = require("./MPXEntryPlugin");
const MPXDynamicEntryPlugin = require("./MPXDynamicEntryPlugin");
const MPXGroupFactory = require("./MPXGroupFactory");
const MPXModuleFactory = require("./MPXModuleFactory");
const { SyncHook } = require("tapable");

const PLUGIN_NAME = "MPXPlugin";

module.exports = class MPXPlugin {
    constructor( options ) {
        options = options || {};
        
        this.name = options.name || "app";
        this.entries = null;
        this.platform = options.platform || "wechat";
    }
    
    apply( compiler ) {
        const entries = compiler.options.entry;
        
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
         * 
         * 3) 动态入口点(Function)模式。
         *    {
         *        "entry": () => ".src/app",
         *        "entry": () => ["./src/app"],
         *        "entry": () => Promise.resolve("./src/app"),
         *        "entry": () => Promise.resolve({ "app": "./src/app" })
         *    }
         */
        if ( typeof entries == "string" || Array.isArray(entries) ) { /*< 1 >*/
            compiler.options.entry = {}; // 跳过 EntryOptionPlugin 插件。
            
            this.entries = entries;
        }
        
        else if ( typeof entries == "object" ) { /*< 2 >*/
            if ( !(this.name in entries) ) {
                throw new Error(`没有找到名为 "${this.name}" 的入口点：entry=${JSON.stringify(entries)}`);
            }
            
            this.entries = entries[this.name];
            delete entries[this.name];
        }
        
        else if ( typeof entries == "function" ) { /*< 3 >*/
            compiler.options.entry = {}; // 跳过 EntryOptionPlugin 插件。
            
            this.entries = entries;
        }
        
        compiler.hooks.entryOption.tap(PLUGIN_NAME, ( context ) => {
            if ( typeof this.entries == "function" ) {
                new MPXDynamicEntryPlugin(context, this.name, this.entries, this.platform).apply(compiler);
            }
            
            else {
                new MPXEntryPlugin(context, this.name, this.entries, this.platform).apply(compiler);
            }
        });
        
        /// 创建小程序模块工厂。
        compiler.hooks.beforeCompile.tap(PLUGIN_NAME, ( params ) => {
            const mpxGroupFactory = new MPXGroupFactory(this.platform);
            const mpxModuleFactory = new MPXModuleFactory(this.platform);
            
            Object.assign(params, { 
                mpxGroupFactory, 
                mpxModuleFactory 
            });
            
            compiler.hooks.mpxGroupFactory.call(mpxGroupFactory);
            compiler.hooks.mpxModuleFactory.call(mpxModuleFactory);
        });
        
        compiler.hooks.mpxGroupFactory = new SyncHook(["mpxGroupFactory"]);
        compiler.hooks.mpxModuleFactory = new SyncHook(["mpxModuleFactory"]);
    }
}