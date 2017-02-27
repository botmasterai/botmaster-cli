import Generator from 'yeoman-generator';
import { printPreNPMInitPromptMessage } from '../utils';

const composedBotClassGenerator = class extends Generator {
  initializing() {
    if (!this.options.standalone) {
      printPreNPMInitPromptMessage(this.log);
      this.composeWith(require.resolve('generator-npm-init/app'));
    }
    this.composeWith(require.resolve('./bot_class_generator'), this.options);
  }
};

module.exports = composedBotClassGenerator;
