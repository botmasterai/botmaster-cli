'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var io = require('socket.io-client');
var chalk = require('chalk');
var readline = require('readline');

var _require = require('./utils'),
    syntaxHighlight = _require.syntaxHighlight;

var consoleBotClient = function consoleBotClient(url, printFullObject) {
  console.log(chalk.yellow('\nTrying to connect to: ' + url + '...\n'));
  var socket = io(url);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green('> ')
  });

  socket.on('connect', function () {
    console.log(chalk.yellow('Successfully connected to: ' + url));
    console.log(chalk.underline.green('\nConverse with your bot:\n'));

    rl.prompt();
  });

  socket.on('connect_error', function () {
    console.error(chalk.bold.red('\ncoudn\'t find any valid client at: ' + url));
    process.exit(1);
  });

  socket.on('message', function (msg) {
    if (!printFullObject) {
      if (msg.sender_action === 'typing_on') {
        console.log('bot is typing');
        return;
      }
      try {
        var botText = msg.message.text;
        console.log(chalk.green('\n' + botText + '\n'));
        rl.prompt();
        return;
      } catch (e) {
        console.log(chalk.red('\nCouldn\'t find any text in your bot\'s message. Here\'s the full update that was received '));
      }
    }
    try {
      console.log(chalk.blue('\nObject your bot replies with:\n'));
      console.log(syntaxHighlight((0, _stringify2.default)(msg, null, 2)));
      console.log('\n');
      rl.prompt();
    } catch (e) {
      console.log(msg);
    }
  });

  rl.on('line', function (line) {
    if (!line) {
      return rl.prompt();
    }
    socket.send({
      text: line
    });
  }).on('close', function () {
    console.log('\n\nLeaving the console bot!');
    process.exit(0);
  });
};

module.exports = consoleBotClient;