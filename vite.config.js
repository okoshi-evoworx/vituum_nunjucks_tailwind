import { defineConfig } from 'vite'
import path from 'path';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import vituum from 'vituum'
import nunjucks from '@vituum/vite-plugin-nunjucks'
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Nunjucksテンプレートに {{ page.path }} を注入するプラグイン。
 * nunjucksプラグインより前に登録すること。
 */
function injectPagePath() {
  const pagesDir = path.resolve(__dirname, 'src/pages')
  return {
    name: 'inject-page-path',
    transformIndexHtml: {
      order: 'pre',
      handler(content, { filename }) {
        if (!filename?.includes('.njk')) return content
        if (!filename.startsWith(pagesDir)) return content
        const pagePath = filename
          .replace(pagesDir, '')
          .replace(/\/index\.njk(?:\.html)?$/, '/')
          .replace(/\.njk(?:\.html)?$/, '.html')
        return `{% set page = { path: "${pagePath}" } %}\n${content}`
      },
    },
  }
}

export default defineConfig(({ mode }) => {
  return {
    // root: './src/',
    // publicDir: 'public/',
      resolve: {
          alias: {
              "@": path.resolve(__dirname, "./src"),
          },
      },
      plugins: [
          ViteImageOptimizer({
            includePublic: true,
            svg: {
              multipass: true,
            },
            png: {
              quality: 100,
            },
            jpeg: {
              quality: 100,
            },
            jpg: {
              quality: 100,
            },
            tiff: {
              quality: 100,
            },
            gif: {},
            webp: {
              lossless: true,
            },
            avif: {
              lossless: true,
            },
        }),
        injectPagePath(),
        vituum({
          pages: {
            root: './src',
            dir: './src/pages',
          },
          imports: {
            paths : ['./src/css/*/**', './src/js/*/**']
          }
        }),
        nunjucks({
          root: './src/',
          data: ['./src/data/**/*.json'],
          globals: {
            mode: mode === 'development' ? 'dev' : 'build'
          }
        })
      ],
      css: {
          transformer: 'postcss',
      },
      build: {
          outDir: 'dist',
          emptyOutDir: true,
          assetsInlineLimit: 0,
          cssMinify: false,
          cssCodeSplit: true,
          rollupOptions: {
            input: [
              './src/css/styles.css',
              './src/pages/**/*.{json,latte,twig,liquid,njk,hbs,pug,html}',
              '!./src/pages/**/*.{latte,twig,liquid,njk,hbs,pug,html}.json'
            ],
            output: {
                  entryFileNames: `js/[name].js`,
                  chunkFileNames: `js/[name].js`,
                  // .jsも.njk内のjsも全部まとめる
                  codeSplitting: {
                    groups: [
                      {
                        name: 'main',
                        test: /(\.js|\.njk)$/
                      }
                    ]
                  },
                  assetFileNames: (assetInfo) => {
                    // https://rollupjs.org/configuration-options/#output-assetfilenames
                    const { name } = assetInfo;
                    // nameが存在しない場合のフォールバック
                    if (!name) {
                      return "assets/[name][extname]";
                    }
  
                    // 拡張子抽出
                    const extType = name.split('.').pop();
  
                    // CSS
                    if (extType === 'css') {
                      return `css/[name][extname]`;
                    }
  
                    // 画像
                    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'avif'];
                    if (imageExtensions.includes(extType)) {
                      return `img/[name][extname]`;
                    }
  
                    // フォント
                    const fontExtensions = ['eot', 'otf', 'ttf', 'woff', 'woff2'];
                    if (fontExtensions.includes(extType)) {
                      return `font/[name][extname]`;
                    }
  
                    // その他のアセット
                    return "assets/[name][extname]";
                  },
              },
          },
      },
  }

});