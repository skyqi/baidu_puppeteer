// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/main.js', // 你的入口文件
    output: {
        file: 'dist/bundle.js', // 输出文件
        format: 'cjs', // 对于 Node.js，通常使用 'cjs'（CommonJS）
        sourcemap: true, // 生成源码映射文件
    },
    plugins: [
        nodeResolve({ preferBuiltins: true }), // 告诉 Rollup 如何处理 Node.js 核心模块
        commonjs(), // 转换 CommonJS 模块到 ES2015 模块
        // 如果你使用 Babel，可以添加如下配置
        // babel({
        //   exclude: 'node_modules/**', // 排除 node_modules 目录
        //   presets: [['@babel/preset-env', { modules: false }]]
        // }),
    ],
    external: ['puppeteer-extra']
};
