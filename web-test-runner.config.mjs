import { fromRollup } from '@web/dev-server-rollup';
import rollupReplace from '@rollup/plugin-replace';
import postcssLitRollup from 'rollup-plugin-postcss-lit';
import aliasRollup from '@rollup/plugin-alias';
import commonjsRollup from '@rollup/plugin-commonjs';
import postcssRollup from 'rollup-plugin-postcss';
import path from 'path';

const replace = fromRollup(rollupReplace);
const postcss = fromRollup(postcssRollup);
const postcssLit = fromRollup(postcssLitRollup);
const alias = fromRollup(aliasRollup);
const commonjs = fromRollup(commonjsRollup);

const nodeModulesPath = path.resolve('./node_modules');

export default {
    rootDir: '.',
    nodeResolve: true,
    preserveSymlinks: true,
    browserLogs: false,
    files: [
        'packages/**/tests/**/*.test.js'
    ],
    mimeTypes: {
        '**/*.css': 'js',
    },
    plugins: [
        alias({
            resolve: ['', './index.js', '.js'],
        }),
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        commonjs({}),
        postcss({
            inject: false
        }),
        postcssLit({}),
    ]
}
