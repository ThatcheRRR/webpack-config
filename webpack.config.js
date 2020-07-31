const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all',
        }
    }

    if(isProd) {
        config.minimizer = [
            new TerserWebpackPlugin(),
            new OptimizeCssAssetsWebpackPlugin()
        ]
    }

    return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const styleLoader = load => {
    const loader = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            }
        },
        'css-loader',
    ]

    if(load) {
        loader.push(load);
    }

    return loader
}

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    optimization: optimization(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: styleLoader()
            },
            {
                test: /\.s[ac]ss/,
                use: styleLoader('sass-loader')
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ]
}