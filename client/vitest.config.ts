import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        globals: true,
        environment: "jsdom",
        include: ["src/**/*.test.{js,ts,tsx}"],
        setupFiles: ["./src/__test__/setup.ts", "./src/__test__/test-utils.tsx"],
      },
    })
  )
);
