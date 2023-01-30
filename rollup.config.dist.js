// This config is adapted from ext/toujou/Resources/rollup.config.js
import nodeResolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import {readdirSync} from 'fs';
import * as path from 'path';
import {commonPlugins, es6Babel} from './etc/common.rollup.js';

const filesToBundle = [];

const packages = readdirSync(new URL('./packages', import.meta.url), {
    withFileTypes: true,
});

for (const pck of packages) {
    const packageName = pck.name
    readdirSync(`./packages/${packageName}/src`).forEach((file) => {
        if (path.extname(file) === '.js') {
            filesToBundle.push({
                packageName: packageName,
                fileName: file
            });
        }
    });
}

// Create config array with configuration for all the found packages
const config = filesToBundle.map((fileToBundle) => {
    return {
        context: 'window',
        input: path.resolve(`./packages/${fileToBundle.packageName}/src/${fileToBundle.fileName}`),
        output: {
            dir: `./packages/${fileToBundle.packageName}/dist/`,
            format: 'esm',
            sourcemap: true,
            compact: true
        },

        plugins: [
            nodeResolve({
                mainFields: ['module', 'main'],
            }),
            ...commonPlugins,
        ],
    };
});
export default () => {
    config.forEach((es6Config) => {
        if (process.env.NODE_ENV === 'production') {
            // eslint-disable-next-line no-param-reassign
            es6Config.output.compact = true;
            es6Config.plugins.push(es6Babel);
            es6Config.plugins.push(terser());
        } else {
            // eslint-disable-next-line no-param-reassign
            es6Config.cache = true;
            // eslint-disable-next-line no-param-reassign
            es6Config.treeshake = false;
        }
    });

    return config;
};
