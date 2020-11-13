module.exports = {
    runtimeCompiler: true,
    css: {
        loaderOptions: {
            scss: {
                // 8.0 以上版本将 data 改为 prependData
                prependData: `@import '@/assets/style/element-variables.scss';`
            }
        }
    }
};
