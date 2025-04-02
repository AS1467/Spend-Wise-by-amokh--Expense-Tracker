
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c2d94cc0f705479f85b6a413761c0e28',
  appName: 'spend-wise',
  webDir: 'dist',
  server: {
    url: 'https://c2d94cc0-f705-479f-85b6-a413761c0e28.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keyAlias: undefined,
      keyPassword: undefined,
      releaseType: undefined,
      signingType: undefined
    }
  }
};

export default config;
