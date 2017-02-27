import Generator from 'yeoman-generator';

const ProjectGenerator = class extends Generator {
  initializing() {

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
      default: 'socketio, messenger',
    };
    if (!this.options.platforms) {
      promptArray.push(platformPrompt);
    }

    return promptArray;
  }

  // _parsePlatformNames() {
  //   if (!this.options.platforms) {
  //     return;
  //   }
  //   // create platforms names array
  //   let platforms = R.split(/[,]|\s/, this.options.platforms);
  //   // remove any dots (for socket.io for instance)
  //   platforms = R.map(R.replace('.', ''), platforms);
  //   // remove empty entries due to using space and commas.
  //   const isEmptyString = str => str !== '';
  //   platforms = R.filter(isEmptyString, platforms);

  //   this.options.platforms = platforms;
  // }

  method2() {
    this.log(this.options.platforms);
  }
};

module.exports = ProjectGenerator;
