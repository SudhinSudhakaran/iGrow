module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts'],
  dependency: {
    vasern: {
      platforms: {
        ios: {
          project: './node_modules/vasern/ios/Vasern.xcodeproj',
          podspecPath: './node_modules/vasern/vasern.podspec',
        },
        android: {
          sourceDir: './node_modules/vasern/android',
          manifestPath: 'src/main/AndroidManifest.xml',
          packageImportPath: 'com.reactlibrary.vasern',
        },
      },
    },
  },
};
