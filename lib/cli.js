/*jshint node: true */

var program = require('commander'),
    yuigen = require('./yuigen.js');

function resolveRoot(val) {
    return require('path').resolve(val);
}

program.version('0.0.9')
    .description('A utility to generate YUI modules and tests.')
        .option('-l, --lib-version <version>', 'Library version to interpolate', '3.4.1')
        .option('-m, --module-prefix <prefix>', 'Prefix dash-prepended to module name')
        .option('-n, --namespace <string>', 'Namespace prefix for interpolation', '')
        .option('-t, --template [name]', 'template for generated file (base|extension|plugin|empty) [base]', 'base')
        .option('-r, --root-path <path>', 'root path for generated content [./]', resolveRoot, './');

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

program.command('module [fileName] [dirName]')
    .description('\tCreate YUI module file "{dirName|fileName}/{fileName}.js"')
        .action(yuigen.cli);

program.command('test [fileName] [dirName]')
    .description('\tCreate YUI test file named "{dirName|fileName}/{fileName}-test.js"')
        .action(yuigen.cli);

program.command('* [fileName] [dirName]')
    .description('\tDefaults command to "module", passing remaining args')
        .action(yuigen.cli);

// program.parse called by ../bin/yuigen
module.exports = program;

// poor man's TDD
if (module === require.main) {
    console.log('hardcore testing action!');
    var assert = require('assert'),
        util = require('util'),

        path = require('path'),
        rootPathDefault = path.resolve('./'),

        tests = [
            ['module foo', {
                cmd: 'module',
                dirName : 'foo',
                fileName: 'foo',
                template: 'base',
                rootPath: rootPathDefault,
                namespace: ''
            }],
            ['module foo -r output', {
                cmd: 'module',
                dirName : 'foo',
                fileName: 'foo',
                template: 'base',
                rootPath: path.join(rootPathDefault, 'output'),
                namespace: ''
            }],
            ['foo -n Z', {
                cmd: 'module',
                dirName : 'foo',
                fileName: 'foo',
                template: 'base',
                rootPath: rootPathDefault,
                namespace: 'Z'
            }],
            ['test bar -n Z -t empty', {
                cmd: 'test',
                dirName : 'bar',
                fileName: 'bar-test',
                template: 'empty',
                rootPath: rootPathDefault,
                namespace: 'Z'
            }],
            ['-r ./quux baz -n Z', {
                cmd: 'module',
                dirName : 'baz',
                fileName: 'baz',
                template: 'base',
                rootPath: path.join(rootPathDefault, 'quux'),
                namespace: 'Z'
            }],
            ['my-ext -t extension -n Z', {
                cmd: 'module',
                dirName : 'my-ext',
                fileName: 'my-ext',
                template: 'extension',
                rootPath: rootPathDefault,
                namespace: 'Z'
            }],
            ['my-plugin -t plugin -n Z.Plugin -m z', {
                cmd: 'module',
                dirName : 'my-plugin',
                fileName: 'my-plugin',
                template: 'plugin',
                rootPath: rootPathDefault,
                modulePrefix: 'z',
                namespace: 'Z.Plugin'
            }]
        ];

    // happens in program.parse(), but only needs to happen once
    program.name = 'yuigen';

    tests.forEach(function (test) {
        var argv = test[0],
            expect = test[1],
            parsed = program.parseOptions(program.normalize(argv.split(' '))),
            parsedArgs = parsed.args;

        // sets the ball rolling (end of program.parse())
        program.parseArgs(parsedArgs, parsed.unknown);

        console.log();
        console.log(util.inspect('yuigen ' + argv, false, 0, true), ':');
        console.log('  _config cmd      :', parsedArgs[2].name);
        console.log('  _config dirName  :', parsedArgs[1]);
        console.log('  _config fileName :', parsedArgs[0]);
        console.log('  _config template :', parsedArgs[2].parent.template);
        console.log('  _config rootPath :', parsedArgs[2].parent.rootPath);

        var actual = yuigen._config.apply(null, parsedArgs);
        console.log();
        console.log(util.inspect(actual, false, 2, true));
        console.log();

        var i, e, a;
        for (i in expect) {
            e = JSON.stringify(expect[i]);
            a = JSON.stringify(actual[i] === undefined ? null : actual[i]);
            if (e && typeof e === "object") {
                assert.deepEqual(e, a);
            } else {
                assert.equal(e, a);
            }
        }

        // reset parent properties set during parsing to defaults
        program.template = 'base';
        program.rootPath = rootPathDefault;
    });
}
