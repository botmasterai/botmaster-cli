const io = require('socket.io-client');
const chalk = require('chalk');
const readline = require('readline');
const { syntaxHighlight } = require('./utils');

const consoleBotClient = (url) => {
  const socket = io(url);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green('> '),
  });

  socket.on('connect', () => {
    console.log(chalk.underline.green('\nConverse with your bot:\n'));

    rl.prompt();
  });

  socket.on('connect_error', () => {
    console.error(chalk.bold.red(`\ncoudn't find a valid client at: ${url}`));
    process.exit(1);
  });

  socket.on('message', (msg) => {
    try {
      console.log(chalk.blue('\nObject your bot replies with:\n'));
      console.log(syntaxHighlight(JSON.stringify(msg, null, 2)));
      console.log('\n');
      rl.prompt();
    } catch(e) {
      console.log(msg);
    }
  });

  rl.on('line', (line) => {
    if (!line) {
      return rl.prompt();
    }
    socket.send({
      text: line,
    });
  }).on('close', () => {
    console.log('\n\nLeaving the console bot!');
    process.exit(0);
  });
};

module.exports = consoleBotClient;

