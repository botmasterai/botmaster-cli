const Generator = require('yeoman-generator');
const utils = require('../utils');

const composedBotClassGenerator = class extends Generator {
  initializing() {
    utils.printPreNPMInitPromptMessage(this.log);
    this.composeWith(require.resolve('generator-npm-init/app'), { 'skip-test': true });
    this.composeWith(require.resolve('./bot_class_generator'));
  }
};

module.exports = composedBotClassGenerator;
