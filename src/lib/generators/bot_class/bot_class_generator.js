import path from 'path';
import inquirer from 'inquirer';
import { camelCase, upperFirst, merge, snakeCase } from 'lodash';
import chalk from 'chalk';
import fsp from 'fs-promise';
import cheerio from 'cheerio';
import Generator from 'yeoman-generator';

const BotClassGenerator = class extends Generator {
  prompting() {
    this.log(chalk.blue('\nNow we will go through the Bot class creation prompt:\n'));

    // because can't feed answers into the inquirer prompt using tests...
    const promptInterface = process.env.NODE_ENV === 'test'
      ? this.prompt.bind(this)
      : inquirer.prompt;

    const promptArray = this._buildPromptArray();
    return promptInterface(promptArray)

    .then((answers) => {
      merge(this.options, answers);
    });
  }

  _buildPromptArray() {
    const promptArray = [];
    const botClassNamePrompt = {
      type: 'input',
      name: 'botClassName',
      message: 'How will your bot class be called?',
      default: BotClassGenerator._createDefaultBotClassName(this.appname),
    };

    const requiresWebhookPrompt = {
      type: 'confirm',
      name: 'requiresWebhook',
      message: 'Will your bot class make the use of webhooks?',
      default: false,
    };

    const codeStylePrompt = {
      type: 'list',
      name: 'codeStyle',
      message: 'What code style will you be writing your code in?',
      choices: [{
        name: 'I will be writing my code in ComonJS (i.e. pick this if you aren\'t using Babel to transpile your code)',
        value: 'CommonJS',
      }, {
        name: 'I will be writing my code in ES2017',
        value: 'ES2017',
      }],
      default: 'CommonJS',
    };


    promptArray.push(botClassNamePrompt);
    promptArray.push(requiresWebhookPrompt);
    promptArray.push(codeStylePrompt);

    return promptArray;
  }

  static _createDefaultBotClassName(folderName) {
    const folderNameWithoutBotmaster = folderName.toLowerCase().replace('botmaster', '');
    const folderNameEndingWithBot = folderNameWithoutBotmaster.endsWith('bot')
      ? folderNameWithoutBotmaster
      : `${folderNameWithoutBotmaster}-bot`;

    return upperFirst(camelCase(folderNameEndingWithBot));
  }

  paths() {
    this.sourceRoot(path.join(__dirname, '../../../../templates'));
  }

  async writing() {
    const botClassName = this.options.botClassName;
    let destinationPath;

    if (this.options.standalone) {
      destinationPath = `${snakeCase(botClassName)}.js`;
    } else {
      await fsp.mkdir('./src');
      await fsp.mkdir('./src/lib');
      destinationPath = `src/lib/${snakeCase(botClassName)}.js`;
    }

    const botClassTemplate = await this._getBotClassTemplate();

    // console.log(botClassTemplate);

    await fsp.writeFile(destinationPath, botClassTemplate);
  }

  async _getBotClassTemplate() {
    const botClassName = this.options.botClassName;
    const botType = this.options.botClassName.toLowerCase().replace('bot', '');

    const bufferBaseTemplate = await fsp.readFile(
      path.join(this.sourceRoot(), 'bot_class_template.xml')
    );
    const baseTemplate = bufferBaseTemplate.toString();

    const $ = cheerio.load(baseTemplate);

    // replace bot-class-name
    const botClassNameElements = $('bot-class-name');
    botClassNameElements.replaceWith(botClassName);

    // replace bot-type
    const botTypeElements = $('bot-type');
    botTypeElements.replaceWith(botType);

    // Clean up the codeStyle lines we do need
    const wantedCodeStyleElements = $(`.${this.options.codeStyle}`);

    wantedCodeStyleElements.map((index, element) => {
      const elementText = $(element).text();
      $(element).replaceWith(elementText);
    });

    // remove the ones we don't need!
    const unwantedCodeStyleElements = $('.codeStyle');
    unwantedCodeStyleElements.remove();

    // deal with requireWebHook botTypeElements
    const requiresWebHookElements = $('.requires-webhook');
    if (!this.options.requiresWebhook) {
      requiresWebHookElements.remove();
    }

    return $('main').text();
  }

  install() {
    // console.log(this.options);
    if (this.options['skip-install']) {
      return;
    }

    this.log(chalk.blue('Installing botmaster!'));

    this.spawnCommand('npm', ['install']);
    this.npmInstall(['botmaster'], { save: true });
  }

  end() {
    this.log(chalk.green('Successfully setup your botclass. You can now hack away at it.'));
    this.log(chalk.blue('\nRead more about how to write bot classes at: http://botmasterai.com/working-with-botmaster/writing-your-own-bot-class/'));
  }
};

module.exports = BotClassGenerator;
