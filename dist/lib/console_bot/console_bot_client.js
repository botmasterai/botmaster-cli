'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var io = require('socket.io-client');
var chalk = require('chalk');
var readline = require('readline');
var hanson = require('hanson');

var _require = require('./utils'),
    syntaxHighlight = _require.syntaxHighlight;

var ConsoleBotClient = function () {
  function ConsoleBotClient(url, printFullObject) {
    (0, _classCallCheck3.default)(this, ConsoleBotClient);

    this.url = url;
    this.printFullObject = printFullObject;

    this.setSendObjectDefaultValues();
    this.setupReadline();
    this.setupSocket();
  }

  (0, _createClass3.default)(ConsoleBotClient, [{
    key: 'setSendObjectDefaultValues',
    value: function setSendObjectDefaultValues() {
      this.sendingObject = false;
      this.openingBracketCount = 0;
      this.closingBracketCount = 0;
      this.potentialObjectBeingSent = '';
    }
  }, {
    key: 'setupReadline',
    value: function setupReadline() {
      var _this = this;

      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk.green('> ')
      });

      this.rl.on('line', function (line) {
        var isSendingObject = line.indexOf('{') > -1 || _this.sendingObject;
        if (isSendingObject) {
          _this.sendingObject = true;
          return _this.trySendingObject(line);
        }

        if (!line) {
          return _this.rl.prompt();
        }

        return _this.socket.send({
          text: line
        });
      });

      this.rl.on('close', function () {
        console.log('\n\nLeaving the console bot!');
        process.exit(0);
      });
    }
  }, {
    key: 'setupSocket',
    value: function setupSocket() {
      var _this2 = this;

      console.log(chalk.yellow('\nTrying to connect to: ' + this.url + '...\n'));
      this.socket = io(this.url);

      this.socket.on('connect', function () {
        console.log(chalk.yellow('Successfully connected to: ' + _this2.url));
        console.log(chalk.underline.green('\nConverse with your bot:\n'));

        _this2.rl.prompt();
      });

      this.socket.on('connect_error', function () {
        console.error(chalk.bold.red('\ncoudn\'t find any valid client at: ' + _this2.url));
        process.exit(1);
      });

      this.socket.on('message', function (message) {
        var printObjectInstead = false;
        if (!_this2.printFullObject) {
          printObjectInstead = _this2.printMessageAsString(message);
        }

        if (_this2.printFullObject || printObjectInstead) {
          _this2.printMessageAsObject(message);
        }
      });
    }
  }, {
    key: 'printMessageAsString',
    value: function printMessageAsString(message) {
      var printObjectInstead = false;

      if (message.sender_action === 'typing_on') {
        console.log('bot is typing');
      } else {
        try {
          var botText = message.message.text;
          console.log(chalk.green('\n' + botText + '\n'));
          this.rl.prompt();
        } catch (e) {
          console.log(chalk.red('\nCouldn\'t find any text in your bot\'s message. Here\'s the full update that was received '));
          printObjectInstead = true;
        }
      }

      return printObjectInstead;
    }
  }, {
    key: 'printMessageAsObject',
    value: function printMessageAsObject(message) {
      try {
        console.log(chalk.blue('\nObject your bot replies with:\n'));
        console.log(syntaxHighlight((0, _stringify2.default)(message, null, 2)));
        console.log('\n');
        this.rl.prompt();
      } catch (e) {
        console.log(message);
      }
    }
  }, {
    key: 'trySendingObject',
    value: function trySendingObject(line) {
      this.openingBracketCount += (line.match(/{/g) || []).length;
      this.closingBracketCount += (line.match(/{/g) || []).length;

      this.potentialObjectBeingSent += line;

      if (this.openingBracketCount === this.closingBracketCount) {
        try {
          var jsonObject = hanson.parse(this.potentialObjectBeingSent);

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
  }], [{
    key: 'sanitizeJSON',
    value: function sanitizeJSON(unsanitized) {
      return unsanitized.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
    }
  }]);
  return ConsoleBotClient;
}();

module.exports = ConsoleBotClient;