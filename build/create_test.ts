const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const snakeCase = require('snake-case');

const testName = process.argv[2];
const snakeName = snakeCase(testName);
const specName = snakeName + '.ts';

// make sure the directory doesn't already exist
const specPath = path.resolve(__dirname, '../test/specs/compilation', specName);

if (fs.existsSync(specPath)) {
    console.log(chalk.red('Error: ') + `A test with a name of '${snakeName}' already exists.`);
    process.exit();
}

const spec = fs.readFileSync(path.resolve(__dirname, './test_scaffold/test.ts'), 'utf8');
fs.writeFileSync(specPath, spec.replace(/_NAME_/g, snakeName));