'use strict';

var yeoman = require('yeoman-environment');
var BotmasterGenerator = require('./botmaster_generator');

var env = yeoman.createEnv();

var bootstrapProject = function bootstrapProject(options) {
  env.registerStub(BotmasterGenerator, 'generate');
  // console.log(JSON.stringify(options, null, 2));

  env.run('generate', options, function (done) {
    console.log('done');
  });
};

module.exports = bootstrapProject;