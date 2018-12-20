const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;
process.traceDeprecation = true;

const webpack = require('webpack');

const common = {
//    mode: 'production',
    mode: 'development',    
    optimization: {
	minimizer: [
	    new UglifyJSPlugin({
		uglifyOptions: {
		    compress: {
			drop_console: true,
		    }
		}
	    })
	]
    },    
    entry: PATHS.app,
    resolve: {
	extensions: ['.js', '.jsx'],
	modules: ['node_modules']
    },

    output: {
	path: PATHS.build,
	filename: 'bundle.js'
    },

    // see https://webpack.js.org/configuration/devtool/
    devtool: 'inline-source-map',
    
    module: {
	rules: [
	    
	    {
		test: /\.(png|woff|woff2|eot|ttf|svg)/,
		loader: 'url-loader?limit=100000'
	    },
	    
	    {
		test: /\.css$/,
		loaders: ['style-loader', 'css-loader'],
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

	    {
		test: /\.js$/,
		loader: 'babel-loader',
		include: PATHS.app
	    },
	    
	    {
		test: /\.jsx?$/,
		loader: 'babel-loader',
		query:
		{
		    // presets:['react', 'es2015', 'stage-0']
		    "presets": ["@babel/preset-env",
				"@babel/preset-react",
				["@babel/preset-stage-0", { "decoratorsLegacy": true }],
			       ]
		},
		include: PATHS.app
	    }	    
	]
    },

    // see https://www.npmjs.com/package/html-webpack-plugin
    plugins: [
	new HtmlwebpackPlugin({
	    inject: false,
	    template: require('html-webpack-template'),
	    hash: true,
	    title: 'CLARIN LRS',
	    appMountId: 'app',
	    favicon: 'app/images/favicon-cog-cblue.ico'
	}),

	new webpack.DefinePlugin({
	    'process.env': {
                'NODE_ENV'           : JSON.stringify('development'),
                //'NODE_ENV'           : JSON.stringify('production'),		

		// include tools that require authentication
		'INCL_TOOLS_REQ_AUTH': JSON.stringify('yes'),
		
		// file storage provider (alt: MPCDF, deprecated )
		'FILE_STORAGE'       : JSON.stringify('NEXTCLOUD'),

		// credentials for NEXTCLOUD (alt: 'claus.zinn@uni-tuebingen.de':'sPL-Fh2-7SS-hCJ')
		'NEXTCLOUD_USER'     : JSON.stringify('switchboard'),
		'NEXTCLOUD_PASS'     : JSON.stringify('clarin-plus'),

		// version as displayed on the main page
		'VERSION'            : JSON.stringify('v1.4.1-dev (Dec 20, 2018)'),

		// contact as displayed of the main page
		'CONTACT'            : JSON.stringify('switchboard@clarin.eu')
	    }
	}),
    ]
};

if(TARGET === 'start' || !TARGET) {

    module.exports = merge(common, {
	devtool: '#inline-source-map',

	devServer: {
	    historyApiFallback: true,
	    hot: true,
	    inline: true,
	    //progress: true,
	    
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
