/// <reference types="vitest" />
// ➕ We need to add this for TypeScript support. If you aren't, you don't need this

export default defineConfig({
    // ... rest of my config
    test: { globals: true, }, // ➕ I'm using globals.If you aren't, you don't need this.
});
