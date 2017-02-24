const yeoman = require('yeoman-environment');
const ProjectGenerator = require('./generators/project_generator');
const MiddlewareGenerator = require('./generators/middleware_generator');
const BotClassGenerator = require('./generators/bot_class');

const env = yeoman.createEnv();

env.registerStub(ProjectGenerator, 'project');
env.registerStub(MiddlewareGenerator, 'middleware');
env.registerStub(BotClassGenerator, 'botClass');

const run = (generatorType, options) => {
  env.run(generatorType, options, (done) => {
    console.log('done');
    console.log(done);
  });
};

module.exports = {
  run,
};

