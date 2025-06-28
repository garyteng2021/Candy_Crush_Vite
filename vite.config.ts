// vite.config.ts
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 3000,
    allowedHosts: ['candycrushvite-production.up.railway.app']
  }
});
