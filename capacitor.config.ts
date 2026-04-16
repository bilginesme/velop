import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bilginesme.velop',
  appName: 'the-velop',
  webDir: 'www',
  // Keep the plugins section; it's correct for the SQLite logic
  plugins: {
    CapacitorSQLite: {
      iosIsEncryption: false,
      iosKeychainPrefix: 'the-velop-sqlite',
    }
  }
};

export default config;