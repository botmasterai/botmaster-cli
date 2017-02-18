#!/usr/bin/env node

const consoleBotClient = require('./consoleBotClient');

require('yargs')
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
