/*jshint node: true */

var program = require('commander'),
    yuigen = require('./yuigen.js');

program.version('0.0.3')
    .usage('[options] [command]')
    .description('A utility to generate YUI modules and tests.')
        .option('-r, --root-path <path>', 'root path for generated content [./]', './');

program.on('--help', function () {
    console.log([
        "Examples:",
        "  yuigen module -r ./foo bar\t=> creates 'bar' module in ./foo",
        "  yuigen test bar\t\t=> creates 'bar-test' in ./",
        ""
    ].join('\n'));
});

program.command('module <name>')
    .description('\tCreate YUI module "<name>"')
        .action(yuigen.cli);

program.command('test <name>')
    .description('\tCreate YUI test "<name>-test"')
        .action(yuigen.cli);

program.command('*')
    .description('Prompt-based creation')
        .action(yuigen.cli);

program.parse(process.argv);
