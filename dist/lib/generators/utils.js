'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printPreNPMInitPromptMessage = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var printPreNPMInitPromptMessage = exports.printPreNPMInitPromptMessage = function printPreNPMInitPromptMessage(logger) {
  logger(_chalk2.default.blue('\nFirst, we will walk through the creation of'));
  logger(_chalk2.default.blue('a standard package.json file using npm init\n'));

  logger(_chalk2.default.green('Here goes the standard message from npm init:\n'));

  logger(_chalk2.default.yellow('This utility will walk you through creating a package.json file.\nIt only covers the most common items, and tries to guess sensible defaults.\n\nSee `npm help json` for definitive documentation on these fields\nand exactly what they do.\n\nUse `npm install <pkg> --save` afterwards to install a package and\nsave it as a dependency in the package.json file.\n'));
};