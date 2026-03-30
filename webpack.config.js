module.exports = {
    // ビルドした際の出力先
    output: {
        path: `${__dirname}/dist`,
        filename: "bundle.js",
    },
    // モード指定 (development or production)
    mode: "development",
    resolve: {
        extensions: [".ts", ".js"],
    },
    // 開発用サーバで起動するパス
    devServer: {
        static: {
            directory: `${__dirname}/dist`,
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
            },
        ],
    },
};