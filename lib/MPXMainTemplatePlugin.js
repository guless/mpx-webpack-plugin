const NodeMainTemplatePlugin = require("webpack/lib/node/NodeMainTemplatePlugin");
const Template = require("webpack/lib/Template");
const { ConcatSource } = require("webpack-sources");

const PLUGIN_NAME = "MPXMainTemplatePlugin";

module.exports = class MPXMainTemplatePlugin {
    apply( mainTemplate ) {
        new NodeMainTemplatePlugin({ "asyncChunkLoading": false }).apply(mainTemplate);
        
        mainTemplate.hooks.bootstrap.tap(PLUGIN_NAME, ( source, chunk, hash ) => {
            return Template.asString([
                source,
                ``,
                `// install a JSONP callback for chunk loaded`,
                `function webpackJsonpCallback( chunkIds, moreModules, executeModules ) { `,
                    Template.indent([
                        `for ( moduleId in moreModules ) { `,
                            Template.indent([
                                `if ( Object.prototype.hasOwnProperty.call(moreModules, moduleId) ) { `,
                                    Template.indent([
                                        mainTemplate.renderAddModule(hash, chunk, "moduleId", "moreModules[moduleId]"),
                                    ]),
                                `}`,
                            ]),
                        `}`,
                    ]),
                    ``,
                    Template.indent([
                        `if ( executeModules && executeModules[0] ) { `,
                            Template.indent([
                                `return ${mainTemplate.requireFn}(${mainTemplate.requireFn}.s = executeModules[0]);`
                            ]),
                        `}`,
                    ]),
                `}`,
            ]);
        });
        
        mainTemplate.hooks.beforeStartup.tap(PLUGIN_NAME, ( source, chunk, hash ) => {
            const jsonpFunction = mainTemplate.outputOptions.jsonpFunction;
            
            return Template.asString([
                `var context = ((typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this) || (new Function("return this"))());`,
                ``,
                `if ( context ) { `,
                    Template.indent([`context[${JSON.stringify(jsonpFunction)}] = webpackJsonpCallback;`]),
                `}`,
                source,
            ]);
        });
    }
}