import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import path from 'path';

const src = path.resolve('src');

export default [
    {
        input: 'src/index.ts',
        plugins: [
            {
                resolveId(importee, importer) {
                    // bit of a hack — TypeScript only really works if it can resolve imports,
                    // but they misguidedly chose to reject imports with file extensions. This
                    // means we need to resolve them here
                    if (
                        importer &&
                        importer.startsWith(src) &&
                        importee[0] === '.' &&
                        path.extname(importee) === ''
                    ) {
                        return path.resolve(path.dirname(importer), `${importee}.ts`);
                    }
                },
            },
            resolve(),
            commonjs(),
            json(),
            typescript({
                include: 'src/**',
                typescript: require('typescript'),
            }),
        ],
        preferBuiltins: true,
        output: {
            file: 'dist/bia.js',
            format: 'umd',
            name: 'bia',
            sourcemap: true,
        },
    },
];