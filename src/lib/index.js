#!/usr/bin/env node

const fp = require('lodash/fp');
const consoleBotClient = require('./console_bot/console_bot_client');
const generatorManager = require('./generator_manager');

require('yargs')
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
        .conflicts('middleware', 'bot-class');
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
      generatorManager.run(
        wantedGenerator, fp.pick(['skip-cache', 'skip-install'])(argv));
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
        default: 'localhost',
      });
      yargs.option('port', {
        alias: 'p',
        describe: 'the port your bot is on',
        default: 3000,
      });
      yargs.option('botmasterUserId', {
        alias: ['userId', 'id', 'i'],
        describe: 'the botmasterUserId you want to connect as. Uses socket.io\'s to generate one by default',
      });
    },
    handler: (argv) => {
      let url = `ws://${argv.host}:${argv.port}`;
      if (argv.botmasterUserId && typeof argv.botmasterUserId === 'string') {
        url += `?botmasterUserId=${argv.botmasterUserId}`;
      }
      consoleBotClient(url);
    },
  })
  .demandCommand(1)
  .help()
  .wrap(100)
  .argv;
