const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
import { compile } from '../src';

// provide some feedback that we're getting started
console.log (chalk.cyan('Compiling test fixtures...'));
console.log ();

// track our successful / failed compilations
let success = 0;
let failed = 0;

// compile all fixtures in the test directory
glob.sync(path.resolve(__dirname, '../test/**/*.bia')).forEach(file => {
    const filename = path.basename(file);
    const name = filename.replace('.bia', '');
    const dirname = path.dirname(file);

    const source = fs.readFileSync(file, 'utf8');

    try {
        const { code } = compile(source, {
            filename,
            name,
            format: 'es',
        });

        fs.writeFileSync(dirname + '/' + name + '.compiled.js', code, 'utf8');
        console.log (chalk.green('Success: '), dirname + '/' + name + '.compiled.js');
        success++;
    } catch(err) {
        console.log (chalk.red('Error:   '), file);
        console.log ('          ' + chalk.gray(err));
        failed++;
    }
    console.log ();
});

// give the success / failed metrics
console.log (chalk.gray(`Successfully compiled ${chalk.green(success)} fixtures, ${chalk.red(failed)} threw errors.`));