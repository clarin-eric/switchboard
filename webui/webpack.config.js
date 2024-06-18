const path = require('path');
const webpack = require('webpack');
const PATHS = {
    compiled_app: __dirname+"/../backend/src/main/resources/webui",
};
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: ['./src/index.jsx'],
    devtool: 'source-map',
    output: {
        path: PATHS.compiled_app,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {   test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    // plugins: [new BundleAnalyzerPlugin()],
    devServer: {
        static: {
            directory: PATHS.compiled_app,
            watch: true,
        },
        historyApiFallback: true,
        proxy: [
            {context: ['/api/**'], target :'http://localhost:8080', changeOrigin: true, secure: false},
            {context: ['/'], target :'http://localhost:8080', changeOrigin: true, secure: false},
            {context: ['/css'], target :'http://localhost:8080', changeOrigin: true, secure: false},
            {context: ['/fonts'], target :'http://localhost:8080', changeOrigin: true, secure: false},
            {context: ['/webfonts'], target :'http://localhost:8080', changeOrigin: true, secure: false},
            {context: ['/images'], target :'http://localhost:8080', changeOrigin: true, secure: false},
            {context: ['/popup'], target :'http://localhost:8080', changeOrigin: true, secure: false},
        ]
    }
};
