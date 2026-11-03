import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite';

function servingDuckThemePlugin(): Plugin {
  let isLibBuild: boolean = false;
  const entryPath: string = fileURLToPath(
    new URL('./src/index.ts', import.meta.url),
  );

  return {
    name: 'serving-duck-theme-exports',
    apply: 'build',
    configResolved(config: ResolvedConfig): void {
      isLibBuild = Boolean(config.build.lib);
    },
    transform(code: string, id: string): string | null {
      if (!isLibBuild || id !== entryPath) {
        return null;
      }
      return `import './styles/style.css';\n${code}`;
    },
    generateBundle(): void {
      if (!isLibBuild) {
        return;
      }

      const tokensPath: string = fileURLToPath(
        new URL('./src/styles/tokens.css', import.meta.url),
      );
      const themePath: string = fileURLToPath(
        new URL('./src/styles/theme.css', import.meta.url),
      );

      const tokensCss: string = readFileSync(tokensPath, 'utf8');
      const rawThemeCss: string = readFileSync(themePath, 'utf8');
      const distThemeCss: string = `${rawThemeCss}\n@source "./index.js";\n`;

      this.emitFile({
        type: 'asset',
        fileName: 'tokens.css',
        source: tokensCss,
      });

      this.emitFile({
        type: 'asset',
        fileName: 'theme.css',
        source: distThemeCss,
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    servingDuckThemePlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'ServingDuck',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
});
