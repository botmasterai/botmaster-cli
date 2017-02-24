#!/usr/bin/env node
'use strict';

var R = require('ramda');
var consoleBotClient = require('./console_bot_client');
var generateProject = require('./generate_project');

require('yargs').command({
  command: 'generate [options]',
  aliases: ['generate-project', 'build-project', 'build', 'create'],
  desc: 'Enables developers to create templated botmaster projects using the preferred architecture',
  builder: function builder(yargs) {
    yargs.option('platforms', {
      alias: ['p', 'clients', 'c'],
      describe: 'the platforms you want your botmaster project to support. Comma or space separated string'
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
  },
  handler: function handler(argv) {
    // let yeoman do the rest
    generateProject(R.pick(['platforms', 'skip-cache', 'skip-install'], argv));
  }
}).command({
  command: 'console-bot [options]',
  aliases: ['bot', 'run', 'start-bot'],
  desc: 'Start a console client that will connect to your socket.io botmaster bot. The connection is made to localhost:3000 by default',
  builder: function builder(yargs) {
    yargs.option('host', {
      alias: 'h',
      describe: 'the host your bot is on',
      default: 'localhost'
    });
    yargs.option('port', {
      alias: 'p',
      describe: 'the port your bot is on',
      default: 3000
    });
    yargs.option('botmasterUserId', {
      alias: ['userId', 'id', 'i'],
      describe: 'the botmasterUserId you want to connect as. Uses socket.io\'s to generate one by default'
    });
  },
  handler: function handler(argv) {
    var url = 'ws://' + argv.host + ':' + argv.port;
    if (argv.botmasterUserId && typeof argv.botmasterUserId === 'string') {
      url += '?botmasterUserId=' + argv.botmasterUserId;
    }
    consoleBotClient(url);
  }
}).demandCommand(1).help().wrap(100).argv;