import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
    rootDir: '.',
    nodeResolve: true,
    preserveSymlinks: true,
    browserLogs: false,
    files: [
        'packages/**/src/tests/**/*.test.js'
    ],
    plugins: [
        esbuildPlugin()
    ]
}
