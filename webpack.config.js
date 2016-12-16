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
            },
            {
                test: /\.hbs/,
                loader: 'handlebars-loader'
            }
        ]
    },
    externals: {
        'jquery': '$',
        'lodash': '_'
    },
    watch: true
};
