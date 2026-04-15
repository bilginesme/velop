import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bilginesme.velop',
  appName: 'the-velop',
  webDir: 'www',
  // Add this section below
  plugins: {
    CapacitorSQLite: {
      iosIsEncryption: false,
      iosKeychainPrefix: 'the-velop-sqlite',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle : "Biometric login for query"
      }
    }
  }
};

export default config;