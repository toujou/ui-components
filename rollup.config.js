import nodeResolve from '@rollup/plugin-node-resolve';
import {commonPlugins, handleEnvironment} from './etc/common.rollup.js';

let config = {
    context: 'window',
    input: 'src/index.js',
    output: {
        dir: `./lib/`,
        format: 'esm',
        sourcemap: true,
        compact: true
    },

    plugins: [
        nodeResolve({
            mainFields: ['module', 'main'],
            // threat all node_modules as external apart css files
            resolveOnly: [/^\.{0,2}\/|\.css$/i],
        }),
        ...commonPlugins,
    ],
};

config = handleEnvironment(config);


export default config;
