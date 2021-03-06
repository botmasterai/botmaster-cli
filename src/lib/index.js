#!/usr/bin/env node

import 'source-map-support/register';
import fp from 'lodash/fp';
import yargs from 'yargs';
import chalk from 'chalk';
import ConsoleBotClient from './console_bot/console_bot_client';
import runGenerator from './run_generator';
import { version } from '../../package.json';
import { extractUrlFromArgv } from './utils';

const baseArgv = yargs
.option('version', {
  alias: 'v',
  description: 'the version of this package',
})
.command({
  command: 'generate',
  aliases: ['generate-project', 'build-project', 'create-project'],
  desc: 'Enables developers to generate templated botmaster projects, middleware or bot class based on passed options. Defaults to project',
  builder: (yargs) => {
    yargs.option('project', {
      alias: ['p'],
      describe: 'generate a new project',
    });
    yargs.option('middleware', {
      alias: ['m'],
      describe: 'generate a new middleware',
    });
    yargs.option('bot-class', {
      alias: ['botClass', 'b'],
      describe: 'generate a new bot class',
    });
    yargs.option('standalone', {
      alias: ['s'],
      describe: 'This option works alongside either bot-class or middleware. If selected, only a bot class or middleware file will be created with no project structure',
    });
    yargs.option('help', {
      alias: ['h'],
    });
    yargs.option('skip-cache', {
      describe: 'Do not remember prompt answers',
      default: false,
    });
    yargs.option('skip-install', {
      describe: 'Do not automatically install dependencies',
      default: false,
    });

    return yargs
      // specify that arguments are pairwise mutually exclusive
      .conflicts('project', 'middleware')
      .conflicts('project', 'bot-class')
      .conflicts('middleware', 'bot-class')
      .conflicts('project', 'standalone');
  },
  handler: (argv) => {
    // let yeoman do the rest
    let wantedGenerator;
    if (argv.project) {
      wantedGenerator = 'project';
    } else if (argv.middleware) {
      wantedGenerator = 'middleware';
    } else if (argv.botClass) {
      wantedGenerator = 'botClass';
    }
    runGenerator(
      wantedGenerator, fp.pick(['skip-cache', 'skip-install', 'standalone'])(argv));
  },
})

.command({
  command: 'console-bot [options]',
  aliases: ['bot', 'run', 'start-bot'],
  desc: 'Start a console client that will connect to your socket.io botmaster bot. The connection is made to localhost:3000 by default',
  builder: (yargs) => {
    yargs.option('host', {
      alias: 'h',
      describe: 'the host your bot is on',
    });
    yargs.option('port', {
      alias: 'p',
      describe: 'the port your bot is on',
    });
    yargs.option('botmasterUserId', {
      alias: ['userId', 'id', 'i'],
      describe: 'the botmasterUserId you want to connect as. Uses socket.io\'s to generate one by default',
    });
    yargs.option('print-full-object', {
      alias: ['full-object', 'f'],
      describe: 'Print the full object response from your bot',
      default: false,
    });
  },
  handler: (argv) => {
    const url = extractUrlFromArgv(argv);
    return new ConsoleBotClient(
      url,
      process.stdin,
      process.stdout,
      argv.printFullObject,
    );
  },
})
.help()
.wrap(100)
.argv;

const command = baseArgv._[0];

if (baseArgv.v) {
  console.log(chalk.green(`\nv${version}`));
} else if (!command) {
  yargs.showHelp();
  console.log(chalk.red('Please enter one of the commands or options'));
}

module.exports = {
  ConsoleBotClient,
};
