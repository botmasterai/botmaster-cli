'use strict';

const io = require('socket.io-client');
const chalk = require('chalk');
const readline = require('readline');
const hanson = require('hanson');
const { syntaxHighlight } = require('./utils');

class ConsoleBotClient {
  constructor(url, printFullObject) {
    this.url = url;
    this.printFullObject = printFullObject;

    this.setSendObjectDefaultValues();
    this.setupReadline();
    this.setupSocket();
  }

  setSendObjectDefaultValues() {
    this.sendingObject = false;
    this.openingBracketCount = 0;
    this.closingBracketCount = 0;
    this.potentialObjectBeingSent = '';
  }

  setupReadline() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.green('> '),
    });

    this.rl.on('line', (line) => {
      const isSendingObject = (line.indexOf('{') > -1) || this.sendingObject;
      if (isSendingObject) {
        this.sendingObject = true;
        return this.trySendingObject(line);
      }

      if (!line) {
        return this.rl.prompt();
      }

      return this.socket.send({
        text: line,
      });
    });

    this.rl.on('close', () => {
      console.log('\n\nLeaving the console bot!');
      process.exit(0);
    });
  }

  setupSocket() {
    console.log(chalk.yellow(`\nTrying to connect to: ${this.url}...\n`));
    this.socket = io(this.url);

    this.socket.on('connect', () => {
      console.log(chalk.yellow(`Successfully connected to: ${this.url}`))
      console.log(chalk.underline.green('\nConverse with your bot:\n'));

      this.rl.prompt();
    });

    this.socket.on('connect_error', () => {
      console.error(chalk.bold.red(`\ncoudn't find any valid client at: ${this.url}`));
      process.exit(1);
    });

    this.socket.on('message', (message) => {
      let printObjectInstead = false;
      if (!this.printFullObject) {
        printObjectInstead = this.printMessageAsString(message);
      }

      if (this.printFullObject || printObjectInstead) {
        this.printMessageAsObject(message);
      }
    });
  }

  printMessageAsString(message) {
    let printObjectInstead = false;

    if (message.sender_action === 'typing_on') {
      console.log('bot is typing');
    } else {
      try {
        const botText = message.message.text;
        console.log(chalk.green(`\n${botText}\n`));
        this.rl.prompt();
      } catch (e) {
        console.log(chalk.red('\nCouldn\'t find any text in your bot\'s message. Here\'s the full update that was received '));
        printObjectInstead = true;
      }
    }

    return printObjectInstead;
  }

  printMessageAsObject(message) {
    try {
      console.log(chalk.blue('\nObject your bot replies with:\n'));
      console.log(syntaxHighlight(JSON.stringify(message, null, 2)));
      console.log('\n');
      this.rl.prompt();
    } catch (e) {
      console.log(message);
    }
  }

  trySendingObject(line) {
    this.openingBracketCount += (line.match(/{/g) || []).length;
    this.closingBracketCount += (line.match(/{/g) || []).length;

    this.potentialObjectBeingSent += line;

    if (this.openingBracketCount === this.closingBracketCount) {
      try {
        const jsonObject = hanson.parse(this.potentialObjectBeingSent);

        this.socket.send(jsonObject);
        this.setSendObjectDefaultValues();
        // this.rl.setPrompt(chalk.green('> '));
      } catch (err) {
        if (err instanceof SyntaxError) {
          console.log(chalk.red('Could\'n parse your JSON object. Please try make sure the object you pass in is a valid JSON object'));
          this.setSendObjectDefaultValues();
          this.rl.prompt();
        } else {
          throw err;
        }
      }
    } else {
      // this.rl.setPrompt(chalk.yellow('object > '));
      // this.rl.prompt();
    }
  }

  static
  sanitizeJSON(unsanitized) {
    return unsanitized.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
  }
}

module.exports = ConsoleBotClient;

