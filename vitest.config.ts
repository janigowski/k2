// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: "./packages/core/BrowserMIDIProvider/test/setup.ts",
    },
});
