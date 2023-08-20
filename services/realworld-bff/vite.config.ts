import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/*.config.*", "**/config/**"],
    coverage: {
      provider: "v8",
    },
  },
});
