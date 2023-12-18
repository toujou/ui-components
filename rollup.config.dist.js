import nodeResolve from '@rollup/plugin-node-resolve';
import {commonPlugins, handleEnvironment} from './etc/common.rollup.js';

let config = {
    context: 'window',
    input: 'src/index.ts',
    output: {
        dir: `./dist/`,
        format: 'esm',
        sourcemap: true,
        compact: true
    },
    plugins: [
        ...commonPlugins,
        nodeResolve({
            mainFields: ['module', 'main', 'browser'],
            preferBuiltins: false
        }),
    ]
};

config = handleEnvironment(config);


export default config;
