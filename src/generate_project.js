const yeoman = require('yeoman-environment');
const BotmasterGenerator = require('./botmaster_generator');

const env = yeoman.createEnv();

const bootstrapProject = (options) => {
  env.registerStub(BotmasterGenerator, 'generate');
      // console.log(JSON.stringify(options, null, 2));

  env.run('generate', options, (done) => {
    console.log('done');
  });
};

module.exports = bootstrapProject;

