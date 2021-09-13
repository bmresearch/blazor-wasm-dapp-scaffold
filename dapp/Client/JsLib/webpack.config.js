const path = require("path");

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    output: {
        path: path.resolve(__dirname, '../wwwroot/js'),
        filename: "jsinterop.js",
        library: "jsinterop"
    },
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
        },
    },
};