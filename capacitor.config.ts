import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bc54af510f2c423e971132129f635b1b',
  appName: 'Čtečka Knih',
  webDir: 'dist',
  server: {
    url: 'https://bc54af51-0f2c-423e-9711-32129f635b1b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;