module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: './build'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader'
            }
        ]
    }
};
