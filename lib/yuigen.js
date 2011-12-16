/*jshint node: true, latedef: false */
/*global exports: true */
// without global config, jshint whines about common pattern

exports = module.exports = yuigen;

exports.cli = function (name, options) {
    var cmd = options.name;
    if (cmd === 'test') {
        name += '-test';
    }
    else if (cmd === '*') {
        cmd = 'module';
    }

    // this => program
    yuigen({
        cmd: cmd,
        name: name,
        rootPath: this.rootPath
    });
};

function yuigen(config) {
    console.log(config);
}
