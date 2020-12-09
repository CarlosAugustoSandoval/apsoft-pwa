module.exports = {
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      navigateFallback: 'index.html',
      exclude: ['.htaccess']
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}
