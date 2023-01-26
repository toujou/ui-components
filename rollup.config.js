// This config is adapted from ext/toujou/Resources/rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import * as babelCore from '@babel/core';
import { terser } from 'rollup-plugin-terser';
import summary from 'rollup-plugin-summary';
import postcss from 'rollup-plugin-postcss';
import postcssLit from 'rollup-plugin-postcss-lit';
import { readdirSync } from 'fs';
import * as path from "path";

// Get a list of all available packages
// const entryPoints = readdirSync(new URL('./packages', import.meta.url), {
//     withFileTypes: true,
// });
// console.log(entryPoints);
// const entryPointNames = [];
// for (const entry of entryPoints) {
//     entryPointNames.push(entry.name);
// }

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
        external: [
            /^lit.*/,
            /^@toujou.*/,
            'js-cookie'
        ],
        plugins: [
            alias({
                resolve: ['', './index.js', '.js'],
                entries: {
                    'mapbox-geocoder': `${__dirname}/node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js`,
                },
            }),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            resolve({
                mainFields: ['module', 'browser', 'main', 'jsnext'],
            }),
            commonjs({
                include: 'node_modules/**',
            }),
            json(),
            postcss({
                inject: false
            }),
            postcssLit(),
            summary()
        ],
    };
});

const es6Babel = babel({
    extensions: ['.css'].concat(babelCore.DEFAULT_EXTENSIONS),
    ignore: [
        /\/core-js/,
        /\/mapbox-gl/,
    ],
    presets: [
        [
            '@babel/env',
            {
                targets: { esmodules: true },
            },
        ],
    ],
    babelHelpers: 'bundled',
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
