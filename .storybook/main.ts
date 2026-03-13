import litcss from 'vite-plugin-lit-css';

// @ts-ignore
import type { StorybookConfig } from '@storybook/web-components-vite';
import remarkGfm from 'remark-gfm';
import { dirname } from "path"
import { fileURLToPath } from "url"

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}
const config: StorybookConfig = {
  "stories": [
    '../stories/**/*.mdx',
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    }
  ],
  "framework": getAbsolutePath('@storybook/web-components-vite'),
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    const litcss = (await import('vite-plugin-lit-css')).default;
    return mergeConfig(config, {
      plugins: [
        litcss({
          include: ['**/packages/**/*.css'], // only apply to component CSS
          exclude: ['**/stories/**/*.css'],  // never apply to story CSS
        })
      ],
      esbuild: {
        tsconfigRaw: {
          compilerOptions: {
            moduleResolution: "bundler",
            experimentalDecorators: true,
            target: "es2018",
            module: "esnext",
          }
        },
      },
    });
  },
};
export default config;
