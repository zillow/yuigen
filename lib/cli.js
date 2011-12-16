/*jshint node: true */

var program = require('commander'),
    yuigen = require('./yuigen.js').cli;

program.version('0.0.3')
    .description('A utility to generate YUI modules and tests.')
        .option('-r, --root-path <path>', 'root path for generated content [./]', './');

program.on('--help', function () {
    console.log([
        "Examples:",
        "  yuigen module foo\t=> creates 'bar' module in ./",
        "  yuigen test bar\t=> creates 'bar-test' test in ./",
        "  yuigen -r ./quux baz\t=> creates 'baz' module in ./quux/",
        ""
    ].join('\n'));
});

program.command('module <name>')
    .description('\tCreate YUI module file named "{name}"')
        .action(yuigen);

program.command('test <name>')
    .description('\tCreate YUI test file named "{name}-test"')
        .action(yuigen);

program.command('*')
    .description('\tDefaults command to "module", passing remaining args')
        .action(yuigen);

program.parse(process.argv);
