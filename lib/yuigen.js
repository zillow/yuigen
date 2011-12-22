/*jshint node: true, latedef: false */
/*global exports: true */
// without global config, jshint whines about common pattern

var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp');

exports = module.exports = yuigen;

exports.cli = function (fileName, dirName, options) {
    // this => options.parent => program
    yuigen(_config(fileName, dirName, options));
};

exports._config = _config;
function _config(fileName, dirName, options) {
    var program = options.parent,
        cmd = options.name,

        builderPattern = program.builder,

        namespace = program.namespace,
        prefix = program.prefix;

    if (!dirName) {
        dirName = fileName;
    }

    if (cmd === 'test') {
        fileName += '-test';
        builderPattern = false;
        // TODO: test dirs should still respect prefixes
    }
    else if (cmd === '*') {
        cmd = 'module';
    }

    // default prefix to namespace, if passed
    if (prefix === '@NAMESPACE@') {
        prefix = namespace && namespace.toLowerCase() || '';
    }

    return {
        cmd: cmd,
        dirName : dirName,
        fileName: fileName,
        template: program.template,
        rootPath: path.resolve(process.cwd(), program.rootPath),
        version : program.libVersion,
        namespace: namespace,
        builder: builderPattern,
        modulePrefix: program.modulePrefix,
        prefix: prefix
    };
}

function yuigen(config) {
    // console.log(config);

    var templateContent = _getTemplateContent(config.template);
    // console.log(templateContent);

    var fileName = config.fileName,
        dirName = config.dirName,

        MODULE = fileName,
        NAMESPACE = config.namespace,
        VERSION = config.version,

        NAME = dashToCamel(fileName),
        KLASS = capCase(NAME),

        PREFIX = config.prefix;

    if (config.modulePrefix) {
        // prefix allowed, but not repeated in MODULE
        if (MODULE.indexOf(PREFIX) < 0) {
            MODULE = PREFIX + '-' + MODULE;
        }
    }
    else {
        // prefix not allowed, and removed from MODULE
        if (MODULE.indexOf(PREFIX) > -1) {
            MODULE = MODULE.replace(new RegExp("^" + PREFIX), '');
        }
    }

    // If Builder pattern followed, module name must match dir/file path names.
    if (config.builder) {
        fileName = dirName = MODULE;
    }

    var destination = [config.rootPath, dirName, fileName + '.js'].join('/'),
        dirPath = path.dirname(destination);

    console.log({
        MODULE: MODULE,
        NAMESPACE: NAMESPACE,
        VERSION: VERSION,
        KLASS: KLASS,
        NAME: NAME,
        filepath: destination,
        dirpath: dirPath
    });

    var replacedContent = templateContent
        .replace(/@MODULE@/g, MODULE)
        .replace(/@NAMESPACE@/g, NAMESPACE)
        .replace(/@VERSION@/g, VERSION)
        .replace(/@KLASS@/g, KLASS)
        .replace(/@NAME@/g, NAME);

    // console.log(replacedContent);

    mkdirp(dirPath, 0755, function (err) {
        if (err) { throw err; }
        fs.writeFile(destination, replacedContent, 'utf8', function (err) {
            if (err) { throw err; }
            console.log('Wrote ' + destination);
        });
    });
}

function _getTemplateContent(templateName) {
    var filepath = path.resolve(__filename + '/../../templates/' + templateName + '.js');
    // console.log(filepath);
    return fs.readFileSync(filepath, 'utf8');
}


function capCase(s) {
    return s.charAt(0).toUpperCase() + s.substring(1);
}

function underscore(s) {
    return s.replace(/(^|[a-z0-9])([A-Z0-9])/g, function(m, before, character) {
        return (before)
            ? before + '_' + character.toLowerCase()
            : character.toLowerCase();
    });
}

function dashToCamel(s) {
    return s.replace(/-+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : '';
    });
}

function camelize(s) {
    return underscore(s).replace(/(_)([a-z0-9])/g, function(m, underscore, character) {
    // return underscore(s).replace(/(^|_)([a-z0-9])/g, function(m, underscore, character) {
        return character.toUpperCase();
    });
}

function dasherize(s) {
    return underscore(s).replace(/_/g, '-');
}
