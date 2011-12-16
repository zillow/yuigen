/*jshint node: true */

var program = require('commander'),
    yuigen = require('./yuigen.js').cli;

program.version('0.0.5')
    .description('A utility to generate YUI modules and tests.')
        .option('-r, --root-path <path>', 'root path for generated content [./]', './');

program.on('--help', function () {
    console.log([
        "  Examples:",
        "",
        "    yuigen module foo      => creates 'bar' module in ./",
        "    yuigen test bar        => creates 'bar-test' test in ./",
        "    yuigen -r ./quux baz   => creates 'baz' module in ./quux/",
        "",
        "  Any optional arguments (without defaults) omitted will be prompted for.",
        ""
    ].join('\n'));
});

program.command('module [fileName] [dirName]')
    .description('\tCreate YUI module file "{dirName|fileName}/{fileName}.js"')
        .action(yuigen);

program.command('test [fileName] [dirName]')
    .description('\tCreate YUI test file named "{dirName|fileName}/{fileName}-test.js"')
        .action(yuigen);

program.command('* [fileName] [dirName]')
    .description('\tDefaults command to "module", passing remaining args')
        .action(yuigen);

// program.parse called by ../bin/yuigen
module.exports = program;
