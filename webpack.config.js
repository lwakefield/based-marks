module.exports = {
    entry: {
        index: './src/index.js',
        settings: './src/settings.js',
        background: './src/background.js'
    },
    output: {
        path: 'dist',
        filename: '[name].js',
    },
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
        ]
    }
};
