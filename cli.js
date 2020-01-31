const applyRules = require('./build/bundle.js');
const fs = require('fs');

if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
}

fs.readFile(process.argv[2], {encoding: 'utf-8'}, function(err,data) {
    if (!err) {
        const styleJson = data;
        console.log(applyRules(JSON.parse(styleJson), { compactOutput: false }));
    } else {
        console.error(err);
    }
});