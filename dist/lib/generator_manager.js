'use strict';

var yeoman = require('yeoman-environment');
var ProjectGenerator = require('./generators/project_generator');
var MiddlewareGenerator = require('./generators/middleware_generator');
var BotClassGenerator = require('./generators/bot_class');

var env = yeoman.createEnv();

env.registerStub(ProjectGenerator, 'project');
env.registerStub(MiddlewareGenerator, 'middleware');
env.registerStub(BotClassGenerator, 'botClass');

var run = function run(generatorType, options) {
  env.run(generatorType, options, function (done) {
    console.log('done');
    console.log(done);
  });
};

module.exports = {
  run: run
};