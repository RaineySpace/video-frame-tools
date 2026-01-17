import { defineConfig } from "tsup";

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'antd'],
  treeshake: true,
  sourcemap: true,
  minify: false,
  splitting: false,
});
