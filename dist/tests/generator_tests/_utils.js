'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var helpers = require('yeoman-test');

function runGenerator(generatorName, prompts, opts, pre) {
  var basename = void 0;

  return new _promise2.default(function (resolve) {
    helpers.run(path.join(__dirname, '../../lib/' + generatorName)).inTmpDir(function (dir) {
      if (pre) {
        pre(dir);
      }
      basename = path.basename(dir);
    }).withOptions(opts || {}).withPrompts(prompts || {}).on('end', function () {
      return resolve(basename);
    });
  });
}

module.exports = {
  runGenerator: runGenerator
};