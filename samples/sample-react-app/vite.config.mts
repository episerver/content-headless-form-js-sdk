import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    // The SDK packages are linked from src/@episerver, so make sure they use the same React copy as the app.
    resolve: {
        dedupe: ["react", "react-dom"],
    },
    // Keep the CRA prefix so existing .env files keep working.
    envPrefix: "REACT_APP_",
    server: {
        // The backend sites (CORS, OIDC redirect URIs, site hostnames) expect the frontend on port 3000.
        port: 3000,
        strictPort: true,
    },
    build: {
        outDir: "build",
    },
});
