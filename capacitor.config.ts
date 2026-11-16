import type { CapacitorConfig } from "@capacitor/cli";
const config: CapacitorConfig = {
  appId: "com.166studio.app",
  appName: "166 STUDIO",
  webDir: "out",
  server: { url: "https://YOUR-VERCEL-DOMAIN.vercel.app", cleartext: false, androidScheme: "https" }
};
export default config;
