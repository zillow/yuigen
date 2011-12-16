/*jshint node: true, latedef: false */

module.exports = {

    createModule: function (name, opt) {
        console.log('createModule {\n  name: "%s"\n  rootPath: "%s"\n}', name, opt.rootPath);
    },

    createTest: function (name, opt) {
        console.log('createTest {\n  name: "%s"\n  rootPath: "%s"\n}', name, opt.rootPath);
    }

};
