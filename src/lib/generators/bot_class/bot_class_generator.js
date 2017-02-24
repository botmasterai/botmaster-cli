const R = require('ramda');
const chalk = require('chalk');
const Generator = require('yeoman-generator');
const getDefaultName = require('../utils').getDefaultName;

const BotClassGenerator = class extends Generator {
  prompting() {

    this.log(chalk.blue('\nNow we will go through the Bot class creation prompt:\n'));

    const promptArray = this._buildPromptArray();
    return this.prompt(promptArray)

    .then((answers) => {
      this.options.platforms = answers.platforms ? answers.platforms : this.options.platforms;
    });
  }

  _buildPromptArray() {
    const promptArray = [];
    const namePrompt = {
      type: 'input',
      name: 'name',
      message: 'How will your bot class be called?',
      default: getDefaultName(this.appname),
    };

    // TODO type name will be name with botmaster stripped out and any
    // occurrences of 'bot' stripped out too.
    // name of class will be type with Bot at the end and starting with a cap

    const webhookRequiredPrompt = {
      type: 'boolean',
      name: 'webhookRequired',
      message: 'Will your bot class make the use of webhooks?',
      default: false,
    };

    const requiredCredentialsPrompt = {
      type: 'input',
      name: 'requiredCredentials',
      message: 'What will be the names of the required credentials for your bot class? (space or comma separated)',
    };

    promptArray.push(namePrompt);
    promptArray.push(webhookRequiredPrompt);
    promptArray.push(requiredCredentialsPrompt);

    return promptArray;
  }

  method2() {
    this.log(this.options.platforms);
  }
};

module.exports = BotClassGenerator;
