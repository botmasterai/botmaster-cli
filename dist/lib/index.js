#!/usr/bin/env node
'use strict';

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _console_bot_client = require('./console_bot/console_bot_client');

var _console_bot_client2 = _interopRequireDefault(_console_bot_client);

var _run_generator = require('./run_generator');

var _run_generator2 = _interopRequireDefault(_run_generator);

var _package = require('../../package.json');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseArgv = _yargs2.default.option('version', {
  alias: 'v',
  description: 'the version of this package'
}).command({
  command: 'generate',
  aliases: ['generate-project', 'build-project', 'create-project'],
  desc: 'Enables developers to generate templated botmaster projects, middleware or bot class based on passed options. Defaults to project',
  builder: function builder(yargs) {
    yargs.option('project', {
      alias: ['p'],
      describe: 'generate a new project'
    });
    yargs.option('middleware', {
      alias: ['m'],
      describe: 'generate a new middleware'
    });
    yargs.option('bot-class', {
      alias: ['botClass', 'b'],
      describe: 'generate a new bot class'
    });
    yargs.option('standalone', {
      alias: ['s'],
      describe: 'This option works alongside either bot-class or middleware. If selected, only a bot class or middleware file will be created with no project structure'
    });
    yargs.option('help', {
      alias: ['h']
    });
    yargs.option('skip-cache', {
      describe: 'Do not remember prompt answers',
      default: false
    });
    yargs.option('skip-install', {
      describe: 'Do not automatically install dependencies',
      default: false
    });

    return yargs
    // specify that arguments are pairwise mutually exclusive
    .conflicts('project', 'middleware').conflicts('project', 'bot-class').conflicts('middleware', 'bot-class').conflicts('project', 'standalone');
  },
  handler: function handler(argv) {
    // let yeoman do the rest
    var wantedGenerator = void 0;
    if (argv.project) {
      wantedGenerator = 'project';
    } else if (argv.middleware) {
      wantedGenerator = 'middleware';
    } else if (argv.botClass) {
      wantedGenerator = 'botClass';
    }
    (0, _run_generator2.default)(wantedGenerator, _fp2.default.pick(['skip-cache', 'skip-install', 'standalone'])(argv));
  }
}).command({
  command: 'console-bot [options]',
  aliases: ['bot', 'run', 'start-bot'],
  desc: 'Start a console client that will connect to your socket.io botmaster bot. The connection is made to localhost:3000 by default',
  builder: function builder(yargs) {
    yargs.option('host', {
      alias: 'h',
      describe: 'the host your bot is on'
    });
    yargs.option('port', {
      alias: 'p',
      describe: 'the port your bot is on'
    });
    yargs.option('botmasterUserId', {
      alias: ['userId', 'id', 'i'],
      describe: 'the botmasterUserId you want to connect as. Uses socket.io\'s to generate one by default'
    });
    yargs.option('print-full-object', {
      alias: ['full-object', 'f'],
      describe: 'Print the full object response from your bot',
      default: false
    });
  },
  handler: function handler(argv) {
    var url = (0, _utils.extractUrlFromArgv)(argv);
    return new _console_bot_client2.default(url, process.stdin, process.stdout, argv.printFullObject);
  }
}).help().wrap(100).argv;

var command = baseArgv._[0];

if (baseArgv.v) {
  console.log(_chalk2.default.green('\nv' + _package.version));
} else if (!command) {
  _yargs2.default.showHelp();
  console.log(_chalk2.default.red('Please enter one of the commands or options'));
}

module.exports = {
  ConsoleBotClient: _console_bot_client2.default
};