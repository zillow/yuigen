/*jshint node: true, latedef: false */

var program = require('commander'),
    yuigen = require('./yuigen.js');

program.version('0.0.2')
    .usage('[options] [command]')
    .description('A utility to generate YUI modules and tests.')
        .option('-r, --root-path [path]', 'root path for generated content [./]', './');

program.on('--help', function () {
    console.log([
        "Examples:",
        "  yuigen -r ./foo module bar\t=> creates 'bar' module in ./foo",
        "  yuigen test bar\t\t=> creates 'bar-test' in ./",
        ""
    ].join('\n'));
});

program.command('module <name>')
    .description('\tCreate YUI module "<name>"')
        .action(function (name) {
            yuigen.createModule(name, program);
        });

program.command('test <name>')
    .description('\tCreate YUI test "<name>-test"')
        .action(function (name) {
            yuigen.createTest(name + '-test', program);
        });

program.parse(process.argv);
