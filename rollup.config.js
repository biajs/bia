import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';

export default [
    {
        input: 'src/index.ts',
        plugins: [
            resolve(),
            commonjs(),
            typescript({
                include: 'src/**',
                typescript: require('typescript'),
            }),
        ],
        output: {
            file: 'dist/bia.js',
            format: 'cjs',
            sourcemap: true,
        },
    },
];