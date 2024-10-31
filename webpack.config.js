const path = require('path');
const mode = process.env.NODE_ENV || 'production';
module.exports = {
    mode: mode,
    entry: './src/main.js',
    output: {
        filename: 'bundle2.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs2'
    },
    externals: {
        // 你可以指定一个字符串，它将被用于从全局变量中获取库
        'puppeteer-extra': 'puppeteer-extra',
        // 或者，如果你希望使用不同的全局变量名，可以这样做：
        // 'puppeteer-extra': 'globalName'
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};


