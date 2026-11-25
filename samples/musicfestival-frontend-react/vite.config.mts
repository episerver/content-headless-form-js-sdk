import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Keep the CRA prefix so existing .env files keep working.
const envPrefix = "REACT_APP_";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), envPrefix);

    return {
        plugins: [react()],
        // The SDK packages are linked from src/@episerver, so make sure they use the same React copy as the app.
        resolve: {
            dedupe: ["react", "react-dom"],
        },
        envPrefix,
        define: {
            // @episerver/forms-react reads this variable through process.env, which only CRA replaced at build time.
            "process.env.REACT_APP_HEADLESS_FORM_BASE_URL": JSON.stringify(env.REACT_APP_HEADLESS_FORM_BASE_URL ?? null),
        },
        server: {
            // The backend sites (CORS, OIDC redirect URIs, site hostnames) expect the frontend on port 3000.
            port: 3000,
            strictPort: true,
        },
        build: {
            outDir: "build",
        },
    };
});
