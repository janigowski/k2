// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: "./packages/core/BrowserMIDIProvider/test/setup.ts",
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['packages/**/*.{ts,tsx}'],
            exclude: ['**/*.d.ts', '**/*.test.{ts,tsx}', '**/node_modules/**'],
            reportsDirectory: './coverage',
            all: true
        }
    },
});
