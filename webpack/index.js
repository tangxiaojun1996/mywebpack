const Compiler = require("./compiler");
const options = require("../mywebpack.config");
const EntryPlugin = require("./EntryPlugin");

// 实例化compiler
const compiler = new Compiler(options);
console.log("init compiler");

// 加载插件，用于make阶段进行编译
new EntryPlugin().apply(compiler);

compiler.run();
