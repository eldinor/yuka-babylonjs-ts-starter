const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// App directory
const appDirectory = fs.realpathSync(process.cwd())

module.exports = {
    entry: {
        navmesh: path.resolve(appDirectory, 'src/index.ts'),
    },
    output: {
        filename: 'js/yuka-babylonjs.js',
        path: path.resolve('./dist/'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            fs: false,
            path: false, // require.resolve("path-browserify")
        },
    },
    module: {
        rules: [
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                loader: 'source-map-loader',
                enforce: 'pre',
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.(png|jpg|gif|env|glb|stl)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: false,
            // filename: 'index.html',
            template: path.resolve(appDirectory, 'public/index.html'),
            // chunks: [],
        }),
        new HtmlWebpackPlugin({
            inject: true,
            filename: 'navmesh.html',
            template: path.resolve(appDirectory, 'public/navmesh.html'),
            chunks: ['navmesh'],
        }),
    ],
}
