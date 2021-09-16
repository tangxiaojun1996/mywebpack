const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("babel-core");

class Compilation {
  constructor(compiler) {
    this.entry = compiler.entry;
    this.loaders = compiler.loaders;
    this.modules = [];
    this.chunks = [];
  }

  build(sealCallback) {
    console.log("start build");

    const runLoaders = (filePath) => {
      let content = fs.readFileSync(filePath, "utf-8");
      this.loaders.forEach((loaderPath) => {
        const loader = require(loaderPath);
        content = loader(content);
      });
      return content;
    };

    const parse = (content) => {
      return parser.parse(content, { sourceType: "module" });
    };

    const getModuleDependencies = (ast) => {
      const dependencies = [];
      traverse(ast, {
        ImportDeclaration: ({ node }) => {
          dependencies.push(node.source.value);
        },
      });
      return dependencies;
    };

    const buildModule = (filename, isEntry) => {
      const filePath = isEntry
        ? filename
        : path.join(process.cwd(), "./src", filename);

      // runLoaders 使用loader翻译文件
      const source = runLoaders(filePath);

      // 将loader解析后的内容转化为AST
      const ast = parse(source);

      // 得到AST后获取模块的依赖
      const dependencies = getModuleDependencies(ast);

      return {
        filename,
        ast,
        dependencies,
      };
    };

    // 解析入口及其依赖的模块
    const entryModule = buildModule(this.entry, true);
    this.modules.push(entryModule);
    this.modules.forEach((_module) => {
      _module.dependencies.forEach((dependency) => {
        this.modules.push(buildModule(dependency));
      });
    });

    console.log("end build");

    // 解析完成，回到call make的callback中即compilation.seal()
    sealCallback();
  }

  seal(emitCallback) {
    console.log("start seal");
    let chunks = "";
    this.modules.forEach((_module) => {
      const { code: transformedCode } = transformFromAst(_module.ast, null, {
        presets: ["env"],
      });
      chunks += `\n '${_module.filename}': function(require, module, exports) { \n ${transformedCode} \n }, \n`;
    });

    const bundle = `
(function(modules) {
  function require(fileName) {
    const fn = modules[fileName];

    const module = { exports : {} };

    fn(require, module, module.exports);

    return module.exports;
  }

  require('${this.entry}');
})({
  ${chunks}
})
`;
    this.chunks.push(bundle);

    // 回到Compiler.emitAssets输出文件
    emitCallback();
  }
}

module.exports = Compilation;
