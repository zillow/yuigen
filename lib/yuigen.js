/*jshint node: true, latedef: false */
/*global exports: true */
// without global config, jshint whines about common pattern

exports = module.exports = yuigen;

exports.cli = function (fileName, dirName, options) {
    var cmd = options.name;

    if (cmd === 'test') {
        fileName += '-test';
    }
    else if (cmd === '*') {
        cmd = 'module';
    }

    // this => program
    yuigen({
        cmd: cmd,
        dirName : dirName || fileName,
        fileName: fileName,
        rootPath: this.rootPath
    });
};

function yuigen(config) {
    console.log(config);
}
