/*jshint node: true */

var program = require('commander'),
    yuigen = require('./yuigen.js').cli;

program.version('0.0.7')
    .description('A utility to generate YUI modules and tests.')
        .option('-t, --template [name]', 'template for generated file (base|extension|plugin|empty) [base]', 'base')
        .option('-r, --root-path <path>', 'root path for generated content [./]', './');

program.on('--help', function () {
    console.log([
        "  Examples:",
        "",
        "    yuigen module foo      => creates 'foo' module in ./",
        "    yuigen foo             => (identical to previous)",
        "    yuigen test bar        => creates 'bar-test' test in ./",
        "    yuigen -r ./quux baz   => creates 'baz' module in ./quux/",
        "",
        "  Any optional arguments (without defaults) omitted will be prompted for.",
        ""
    ].join('\n'));
});

program.command('* [fileName] [dirName]')
    .description('\tCreate YUI module file "{dirName|fileName}/{fileName}.js"')
        .action(yuigen);

program.command('test [fileName] [dirName]')
    .description('\tCreate YUI test file named "{dirName|fileName}/{fileName}-test.js"')
        .action(yuigen);

// program.parse called by ../bin/yuigen
module.exports = program;
