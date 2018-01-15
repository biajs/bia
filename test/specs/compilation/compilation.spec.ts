describe('compilation', () => {
    const fs = require('fs');
    const path = require('path');

    const currentPath = path.resolve(__dirname);
    const dirs = fs.readdirSync(currentPath).filter(f => fs.statSync(path.join(currentPath, f)).isDirectory())

    // dirs.forEach(dir => {
    //     const testDir = `${currentPath}/${dir}`;
        
    //     require(`${testDir}/test`).default(`${testDir}/Component.bia`);
    // });
});