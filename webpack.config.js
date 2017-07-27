const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');

const merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const webpack = require('webpack');

const common = {
  // Entry accepts a path or an object of entries.
  // The build chapter contains an example of the latter.
    entry: PATHS.app,

    // Add resolve.extensions. '' is needed to allow imports
    // without an extension. Note the .'s before extensions!!!
    // The matching will fail without!
    resolve: {
	extensions: ['', '.js', '.jsx'],
	modulesDirectories: ['node_modules']
    },

    node: {
	fs: 'empty',
	net: 'empty',
	tls: 'empty'
    },

    output: {
	path: PATHS.build,
	filename: 'bundle.js'
    },

    devtool: 'inline-source-map',
    module: {
	loaders: [
	    
	    {
		test: /\.(png|woff|woff2|eot|ttf|svg)/,
		loader: 'url-loader?limit=100000'
	    },
	    
	    
	    {
		// Test expects a RegExp! Note the slashes!
		test: /\.css$/,
		loaders: ['style', 'css'],
		// Include accepts either a path or an array of paths.
		include: PATHS.app
	    },
	    
	    
	    {
		test: /\.(png|jpg)$/,
		loader: 'file-loader?name=[name].[ext]',
		include: PATHS.app.images
	    },

	    {
		test: /\.(htm|html)$/,
		loader: 'file-loader?name=[name].[ext]',
		include: PATHS.app.html
	    },

	    // Set up jsx. This accepts js too thanks to RegExp
	    {
		test: /\.jsx?$/,
		// Enable caching for improved performance during development
		// It uses default OS directory by default. If you need something
		// more custom, pass a path to it. I.e., babel?cacheDirectory=<path>
		loader: 'babel',
		query:
		{
		    presets:['react', 'es2015', 'stage-0']
		},
		include: PATHS.app
	    }	    
	]
    },

    // see https://www.npmjs.com/package/html-webpack-plugin
    plugins: [
	new HtmlwebpackPlugin({
	    template: 'app/template.html',
	    hash: true,
	    title: 'CLARIN LANGUAGE RESOURCE SWITCHBOARD',
	    appMountId: 'app',
	    favicon: 'app/images/lrs.png'
	}),

	new webpack.DefinePlugin({
	    'process.env.URL_PATH': JSON.stringify('/clrs-dev')
	})
    ]
};

// Default configuration
if(TARGET === 'start' || !TARGET) {

    module.exports = merge(common, {
	devtool: '#inline-source-map',

	devServer: {
	    historyApiFallback: true,
	    hot: true,
	    inline: true,
	    progress: true,
	    
	    // Display only errors to reduce the amount of output.
	    stats: 'errors-only',
	    
	    // Parse host and port from env so this is easy to customize.
	    host: process.env.HOST,
	    port: process.env.PORT
	},
	plugins: [
	    new webpack.HotModuleReplacementPlugin()
	]
    });
}

if(TARGET === 'build') {
  module.exports = merge(common, {});
}