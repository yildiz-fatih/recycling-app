const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (_, argv) => ({
    mode: argv.mode ?? 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
        clean: true,          // auto-wipe old builds
    },
    devServer: {
        static: { directory: path.join(__dirname, 'public') },
        port: 8081,
        open: true,
        hot: true,
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.m?jsx?$/, exclude: /node_modules/, use: 'babel-loader' },
        ],
    },
    optimization: {
        minimize: argv.mode === 'production',
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',   // the source file at project root
            filename: 'index.html'    // emitted into /public
        })
    ]
});
