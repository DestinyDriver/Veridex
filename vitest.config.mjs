import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["__tests__/**/*.test.js"],
    environment: "node",
  },
  resolve: {
    // Match Next.js: allow extensionless imports like `from "./pricing-data"`.
    extensions: [".js", ".mjs", ".json"],
  },
});
