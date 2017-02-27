'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yeomanEnvironment = require('yeoman-environment');

var _yeomanEnvironment2 = _interopRequireDefault(_yeomanEnvironment);

var _project_generator = require('./generators/project_generator');

var _project_generator2 = _interopRequireDefault(_project_generator);

var _middleware_generator = require('./generators/middleware_generator');

var _middleware_generator2 = _interopRequireDefault(_middleware_generator);

var _bot_class = require('./generators/bot_class');

var _bot_class2 = _interopRequireDefault(_bot_class);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = _yeomanEnvironment2.default.createEnv();

env.registerStub(_project_generator2.default, 'project');
env.registerStub(_middleware_generator2.default, 'middleware');
env.registerStub(_bot_class2.default, 'botClass');

var runGenerator = function runGenerator(generatorName, options) {
  env.run(generatorName, options);
};

exports.default = runGenerator;