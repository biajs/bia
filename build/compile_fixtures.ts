const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
import { compile } from '../src';

console.log ('Compiling test fixtures...');

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
    } catch(err) {
        console.log (chalk.red('Error:   '), file);
        console.log ('          ' + chalk.red(err));
    }
    console.log ();
});