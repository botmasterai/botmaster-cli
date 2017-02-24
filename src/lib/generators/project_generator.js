const fp = require('lodash/fp');
const Generator = require('yeoman-generator');

const ProjectGenerator = class extends Generator {
  initializing() {
    // this.composeWith(require.resolve('generator-npm-init/app'));
  }

  prompting() {
    const promptArray = this._buildPromptArray();
    return this.prompt(promptArray)

    .then((answers) => {
      this.options.platforms = answers.platforms ? answers.platforms : this.options.platforms;
      this._parsePlatformNames();
    });
  }

  _buildPromptArray() {
    const promptArray = [];
    const platformPrompt = {
      type: 'input',
      name: 'platforms',
      message: 'Which platforms would you like to support?',
      default: 'socket.io, messenger',
    };
    if (!this.options.platforms) {
      promptArray.push(platformPrompt);
    }

    return promptArray;
  }

  _parsePlatformNames() {
    if (!this.options.platforms) {
      return;
    }
    // create platforms names array
    let platforms = fp.split(/[,]|\s/)(this.options.platforms);
    // remove any dots (for socket.io for instance)
    platforms = fp.map(fp.replace(/[.]/g)(''))(platforms);
    // remove empty entries due to using space and commas.
    const isEmptyString = str => str !== '';
    platforms = fp.filter(isEmptyString)(platforms);

    this.options.platforms = platforms;
  }

  method2() {
    this.log(this.options.platforms);
  }
};

module.exports = ProjectGenerator;
