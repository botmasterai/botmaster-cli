'use strict';

const io = require('socket.io-client');
const chalk = require('chalk');
const readline = require('readline');
const hanson = require('hanson');
const { syntaxHighlight } = require('../utils');

class ConsoleBotClient {
  constructor(url, reader, writer, printFullObject) {
    this.url = url;
    this.reader = reader;
    // we use the writer separately from rl (i.e. not using rl.write(), because)
    // otherwise, written lines would be caught by `this.rl.on('line', ...)`
    this.writer = writer;
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
      this.writer.write('\n\nLeaving the console bot!');
      process.exit(0);
    });
  }

  setupSocket() {
    this.writer.write(chalk.yellow(`\nTrying to connect to: ${this.url}...\n`));
    this.socket = io(this.url);

    this.socket.on('connect', () => {
      this.writer.write(chalk.yellow(`Successfully connected to: ${this.url}`));
      this.writer.write(chalk.underline.green('\nConverse with your bot:\n'));

      this.rl.prompt();
    });

    this.socket.on('connect_error', () => {
      console.error(chalk.bold.red(`\nCoudn't find any valid client at: ${this.url}`));
      process.exit(1);
    });

    this.socket.on('connect_timeout', () => {
      console.error(chalk.bold.red(`\nConnection timed out trying to connect to: ${this.url}`));
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
      this.writer.write('bot is typing');
    } else {
      try {
        const botText = message.message.text;
        this.writer.write(chalk.green(`\n${botText}\n`));
        this.rl.prompt();
      } catch (e) {
        this.writer.write(chalk.red('\nCouldn\'t find any text in your bot\'s message. Here\'s the full update that was received '));
        printObjectInstead = true;
      }
    }

    return printObjectInstead;
  }

  printMessageAsObject(message) {
    try {
      this.writer.write(chalk.blue('\nObject your bot replies with:\n'));
      this.writer.write(syntaxHighlight(JSON.stringify(message, null, 2)));
      this.writer.write('\n');
      this.rl.prompt();
    } catch (e) {
      this.writer.write(message);
    }
  }

  trySendingObject(line) {
    this.openingBracketCount += (line.match(/{/g) || []).length;
    this.closingBracketCount += (line.match(/}/g) || []).length;

    this.potentialObjectBeingSent += line;

    if (this.openingBracketCount === this.closingBracketCount) {
      try {
        const jsonObject = hanson.parse(this.potentialObjectBeingSent);

        this.socket.send(jsonObject);
        this.setSendObjectDefaultValues();
        // this.rl.setPrompt(chalk.green('> '));
      } catch (err) {
        if (err instanceof SyntaxError) {
          this.writer.write(chalk.red('Could\'n parse your JSON object. Please try make sure the object you pass in is a valid JSON object'));
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

  static sanitizeJSON(unsanitized) {
    return unsanitized.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
  }
}

module.exports = ConsoleBotClient;

