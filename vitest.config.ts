// Settings for the tests. When this file exists, Vitest reads it and not vite.config.ts,
// so the "@" alias is repeated here.

import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        // only the tests that sit next to the source
        include: ["src/**/*.test.{ts,tsx}"],

        // these tests cover plain functions, so no browser is needed
        environment: "node",

        // Run every test as if the machine were in BC. Several helpers use the local timezone,
        // and without this the same test could pass on your laptop and fail on a machine set to UTC.
        env: { TZ: "America/Vancouver" },
    },
});
