const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    // 'transform-decorators-legacy',
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
    favicon: './src/assets/logo.svg'
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
  "commons": [
    {
      name: 'vendor',
      minChunks: Infinity,
    }, {
      name: 'common',
      minChunks: function (module) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, './node_modules')
          ) === 0
        )
      },
      chunks: ['index'],
    }, {
      name: 'manifest',
      chunks: ['vendor', 'common', 'index']
    }

  ],
};
