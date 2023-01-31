import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import postcssLit from 'rollup-plugin-postcss-lit';
import summary from 'rollup-plugin-summary';
import babel from '@rollup/plugin-babel';
import * as babelCore from '@babel/core';

export const commonPlugins = [
    alias({
        resolve: ['', './index.js', '.js'],
        entries: {
            '@mapbox/mapbox-gl-geocoder': `${__dirname}/node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js`,
        },
    }),
    replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
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
];


export const es6Babel = babel({
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
