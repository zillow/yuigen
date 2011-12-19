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
    var parent = options.parent,
        cmd = options.name;

    if (cmd === 'test') {
        if (!dirName) {
            dirName = fileName;
        }
        fileName += '-test';
    }
    else if (cmd === '*') {
        cmd = 'module';
    }

    return {
        cmd: cmd,
        dirName : dirName || fileName,
        fileName: fileName,
        template: parent.template,
        rootPath: path.resolve(process.cwd(), parent.rootPath),
        version : parent.libVersion,
        namespace: parent.namespace,
        modulePrefix: parent.modulePrefix
    };
}

function yuigen(config) {
    // console.log(config);

    var templateContent = _getTemplateContent(config.template);
    // console.log(templateContent);

    var fileName = config.fileName,
        moduleNamespace = config.namespace,

        prefixedModuleName = [fileName],
        destination = [config.rootPath, config.dirName, fileName + '.js'].join('/'),
        dirPath = path.dirname(destination),

        moduleName = dashToCamel(fileName),
        moduleClass = capCase(moduleName);

    if (config.modulePrefix) {
        prefixedModuleName.unshift(config.modulePrefix);
    }
    else if (moduleNamespace) {
        prefixedModuleName.unshift(moduleNamespace.toLowerCase());
    }

    prefixedModuleName = prefixedModuleName.join('-');

    console.log({
        prefixed: prefixedModuleName,
        NAME: moduleName,
        KLASS: moduleClass,
        namespace: moduleNamespace,
        filepath: destination,
        dirpath: dirPath
    });

    var replacedContent = templateContent
        .replace(/@MODULE@/g, prefixedModuleName)
        .replace(/@NAMESPACE@/g, moduleNamespace)
        .replace(/@VERSION@/g, config.version)
        .replace(/@KLASS@/g, moduleClass)
        .replace(/@NAME@/g, moduleName);

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
