const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': 'orange',
              '@layout-body-background': 'whitesmoke',
              '@layout-header-background': 'white',
              '@layout-header-height': '52px',
              '@layout-trigger-height': 'auto',
              '@layout-zero-trigger-height': 'auto',
              '@layout-header-padding': '8px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};