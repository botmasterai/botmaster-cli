const chalk = require('chalk');

const getDefaultName = (appName) => {
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const nameArray = appName.split(' ');

  if (nameArray.length > 1) {
    for (let j = 1; j < nameArray.length; j += 1) {
      nameArray[j] = capitalizeFirstLetter(nameArray[j]);
    }

    return nameArray.join('');
  }

  return nameArray[0];
};

const printPreNPMInitPromptMessage = (logger) => {
  logger(chalk.blue('\nFirst, we will walk through the creation of'));
  logger(chalk.blue('a standard package.json file using npm init\n'));

  logger(chalk.green('Here goes the standard message from npm init:\n'));

  logger(chalk.yellow(`This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See \`npm help json\` for definitive documentation on these fields
and exactly what they do.

Use \`npm install <pkg> --save\` afterwards to install a package and
save it as a dependency in the package.json file.\n`));
};


module.exports = {
  getDefaultName,
  printPreNPMInitPromptMessage,
};
