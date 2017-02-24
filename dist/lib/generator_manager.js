'use strict';

var yeoman = require('yeoman-environment');
var projectGenerator = require('./generators/project_generator');
var middlewareGenerator = require('./generators/middleware_generator');
var botClassGenerator = require('./generators/bot_class_generator');

var env = yeoman.createEnv();

var run = function run(generatorType, options) {
  env.registerStub(projectGenerator, 'project');
  env.registerStub(middlewareGenerator, 'middleware');
  env.registerStub(botClassGenerator, 'botClass');

  env.run(generatorType, options, function (done) {
    console.log('done');
    console.log(done);
  });
};

module.exports = {
  run: run
};