import { version } from './package.json';

export default {
  expo: {
    name: 'A3RLRPG-Infoapp',
    slug: 'A3RLRPG-Infoapp',
    version: version,
    orientation: 'portrait',
    icon: './assets/dag-blobbo.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/dag-blobbo-small.png',
      resizeMode: 'contain',
      backgroundColor: '#fff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      permissions: ['NOTIFICATIONS'],
      googleServicesFile: './google-services.json',
      versionCode: 2,
      adaptiveIcon: {
        foregroundImage: './assets/dag-blobbo.png',
        backgroundColor: '#fff',
      },
      package: 'de.dulliag.A3RLRPGInfoapp',
    },
    web: {
      favicon: './assets/dag-blobbo.png',
    },
  },
};
