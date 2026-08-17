const webpack = require('webpack');
const path = require('path');

module.exports = {
  productionSourceMap: false,
  filenameHashing: true,
  transpileDependencies: [
    'vuetify'
  ],

  outputDir: path.resolve(__dirname, `dist/${process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'prod-pq' ? `Ecare ${process.env.npm_package_version} - ${process.env.NODE_ENV}` : process.env.NODE_ENV}`),

  configureWebpack:{
    plugins: [
      new webpack.DefinePlugin({
        'process.env.VUE_APP_TMS_URL': JSON.stringify(getTmsUrl()),
        'process.env.VUE_APP_CMS_URL': JSON.stringify(getCmsUrl()),
        'process.env.VUE_APP_REQUEST_TOKEN': JSON.stringify(getRequestToken()),
        'process.env.VUE_APP_ENV': JSON.stringify(getENV())
      })
    ]
  },

  chainWebpack: config => {
    config.module
      .rule('pdf')
      .test(/\.pdf$/i)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]',
        esModule: false
      });
  }
}

// Function to get the correct TMS URL based on build mode
function getTmsUrl() {
  if (process.env.NODE_ENV === 'qa') {
    return 'https://testqa-tms-backend.eurekare.net/';
  } else if (process.env.NODE_ENV === 'demo') {
    return 'https://testqav2-tms.eurekare.net/';
  } else if (process.env.NODE_ENV === 'prod') {
    return  'https://prod-local-tms.eurekare.net/';
  } else if (process.env.NODE_ENV === 'prod-pq') {
    return  'https://client1-tms-prod.eurekare.net/'; //PRODUCTION URL IN PARANAQUE
  } else {
    // return 'https://dev-tms.eurekare.net:61012/'; 
    return 'https://dev-tms.eurekare.net/'; // Default token dev URL
  }
}

// Function to get the correct CMS URL based on build mode
function getCmsUrl() {
  if (process.env.NODE_ENV === 'qa') {
    return 'https://testqa-cms-backend.eurekare.net/';
  } else if (process.env.NODE_ENV === 'demo') {
    return 'https://testqav2-cms.eurekare.net/';
  } else if (process.env.NODE_ENV === 'prod') {
    return 'https://prod-local-cms.eurekare.net/';
  } else if (process.env.NODE_ENV === 'prod-pq') {
    return  'https://client1-cms-prod.eurekare.net/'; //PRODUCTION URL IN PARANAQUE
  } else {
    // return 'https://cms-dynamic-db.eurekare.net:61012/'
    // return 'https://dev-cms.eurekare.net:61012/'; 
    return 'https://dev-cms.eurekare.net/'; // Default token dev URL
  }
}

// Function to get the correct Request Token based on build mode
function getRequestToken() {
  if (process.env.NODE_ENV === 'qa') {
    return '';
    // return 'ZUNhcmVfU3lzX1Rva2VuX1Rlc3RxYQ==+TD%X';
  } else if (process.env.NODE_ENV === 'demo') {
    return '';
    // return 'ZUNhcmVfU3lzX1Rva2VuX0RlbW8==+TD%X';
  } else if (process.env.NODE_ENV === 'prod') {
    return '';
  } else if (process.env.NODE_ENV === 'prod-pq') {
    return '';
  } else {
    return 'ZUNhcmVfU3lzX1Rva2VuX0Rldg==+TD%X'; // Default token dev URL
  }
}

function getENV() {
  if (process.env.NODE_ENV === 'qa') {
    // return '';
    return 'QA';
  } else if (process.env.NODE_ENV === 'demo') {
    return 'DEMO';
  } else if (process.env.NODE_ENV === 'prod') {
    return '';
  } else if (process.env.NODE_ENV === 'prod-pq') {
    return '';
  } else {
    return 'DEV'; // Default ENV dev URL
  }
}

