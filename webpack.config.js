const path = require('path')
module.exports = {
    mode: 'development',
    entry: {
        'app': './app.js'
    },
    devtool: 'none',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist/',
        chunkFilename: '[name].js'
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.ts?$/, loader: "ts-loader" }
        ]
    }
};
