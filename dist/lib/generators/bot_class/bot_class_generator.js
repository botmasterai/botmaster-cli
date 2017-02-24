'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var chalk = require('chalk');
var Generator = require('yeoman-generator');

var BotClassGenerator = function (_Generator) {
  (0, _inherits3.default)(BotClassGenerator, _Generator);

  function BotClassGenerator() {
    (0, _classCallCheck3.default)(this, BotClassGenerator);
    return (0, _possibleConstructorReturn3.default)(this, (BotClassGenerator.__proto__ || (0, _getPrototypeOf2.default)(BotClassGenerator)).apply(this, arguments));
  }

  (0, _createClass3.default)(BotClassGenerator, [{
    key: 'prompting',
    value: function prompting() {
      var _this2 = this;

      console.log(this.destinationPath());
      console.log(this.destinationRoot());
      this.log(chalk.blue('\nNow we will go through the Bot class creation prompt:\n'));

      var promptArray = this._buildPromptArray();
      return this.prompt(promptArray).then(function (answers) {
        _this2.options.platforms = answers.platforms ? answers.platforms : _this2.options.platforms;
      });
    }
  }, {
    key: '_buildPromptArray',
    value: function _buildPromptArray() {
      var promptArray = [];
      var namePrompt = {
        type: 'input',
        name: 'name',
        message: 'How will your bot class be called?',
        default: _.camelCase(this.appname)
      };

      // TODO type name will be name with botmaster stripped out and any
      // occurrences of 'bot' stripped out too.
      // name of class will be type with Bot at the end and starting with a cap

      var webhookRequiredPrompt = {
        type: 'boolean',
        name: 'webhookRequired',
        message: 'Will your bot class make the use of webhooks?',
        default: false
      };

      var requiredCredentialsPrompt = {
        type: 'input',
        name: 'requiredCredentials',
        message: 'What will be the names of the required credentials for your bot class? (space or comma separated)'
      };

      promptArray.push(namePrompt);
      promptArray.push(webhookRequiredPrompt);
      promptArray.push(requiredCredentialsPrompt);

      return promptArray;
    }
  }, {
    key: 'method2',
    value: function method2() {
      console.log(this.destinationPath());
      console.log(this.destinationRoot());
      // this.log(this.options.platforms);
    }
  }]);
  return BotClassGenerator;
}(Generator);

module.exports = BotClassGenerator;