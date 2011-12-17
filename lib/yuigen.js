/*jshint node: true, latedef: false */
/*global exports: true */
// without global config, jshint whines about common pattern

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
        rootPath: parent.rootPath
    };
}

function yuigen(config) {
    // console.log(config);
}
