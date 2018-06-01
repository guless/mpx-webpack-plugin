const Module = require("webpack/lib/Module");
const Template = require("webpack/lib/Template");
const { RawSource } = require("webpack-sources");

module.exports = class MPXMultiModule extends Module {
    constructor( context, dependencies, name ) {
        super("javascript/dynamic", context);
        
        this.dependencies = dependencies;
        this.name = name;
    }
    
    identifier() {
        return "miniprogram multi module" + this.dependencies.map(item => item.request).join(" ");
    }
    
    readableIdentifier( requestShortener ) {
        return "miniprogram multi module" + this.dependencies.map(item => requestShortener.shorten(item.request)).join(" ");
    }
    
	build(options, compilation, resolver, fs, callback) {
		this.built = true;
		this.buildMeta = {};
		this.buildInfo = {};
		return callback();
	}
    
    size() {
		return 16 + this.dependencies.length * 12;
	}

	updateHash(hash) {
		hash.update("miniprogram multi module");
		hash.update(this.name || "");
		super.updateHash(hash);
    }
    
    needRebuild() {
		return false;
	}

	source(dependencyTemplates, runtimeTemplate) {
		const str = [];
		let idx = 0;
		for (const dep of this.dependencies) {
			if (dep.module) {
				if (idx === this.dependencies.length - 1) str.push("module.exports = ");
				str.push("__webpack_require__(");
				if (runtimeTemplate.outputOptions.pathinfo)
					str.push(Template.toComment(dep.request));
				str.push(`${JSON.stringify(dep.module.id)}`);
				str.push(")");
			} else {
				const content = require("./dependencies/WebpackMissingModule").module(
					dep.request
				);
				str.push(content);
			}
			str.push(";\n");
			idx++;
		}
		return new RawSource(str.join(""));
	}
}