const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const snakeCase = require('snake-case');

const testName = process.argv[2];
const snakeName = snakeCase(testName);

// make sure the directory doesn't already exist
const dirName = path.resolve(__dirname, '../test/specs/compilation', snakeName);

if (fs.existsSync(dirName)) {
    console.log(chalk.red('Error: ') + `A test with a name of '${snakeName}' already exists.`);
    process.exit();
}

// and if it doesn't, copy over the test scaffold
fs.mkdirSync(dirName);

const fixture = fs.readFileSync(path.resolve(__dirname, './test_scaffold/Component.bia'), 'utf8');
fs.writeFileSync(dirName + '/Component.bia', fixture);

const spec = fs.readFileSync(path.resolve(__dirname, './test_scaffold/test.ts'), 'utf8');
fs.writeFileSync(dirName + '/test.ts', spec.replace('_NAME_', snakeName));