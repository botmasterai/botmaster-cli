'use strict';

var chalk = require('chalk');

var printPreNPMInitPromptMessage = function printPreNPMInitPromptMessage(logger) {
  logger(chalk.blue('\nFirst, we will walk through the creation of'));
  logger(chalk.blue('a standard package.json file using npm init\n'));

  logger(chalk.green('Here goes the standard message from npm init:\n'));

  logger(chalk.yellow('This utility will walk you through creating a package.json file.\nIt only covers the most common items, and tries to guess sensible defaults.\n\nSee `npm help json` for definitive documentation on these fields\nand exactly what they do.\n\nUse `npm install <pkg> --save` afterwards to install a package and\nsave it as a dependency in the package.json file.\n'));
};

module.exports = {
  printPreNPMInitPromptMessage: printPreNPMInitPromptMessage
};