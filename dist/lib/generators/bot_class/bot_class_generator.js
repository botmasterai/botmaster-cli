'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _lodash = require('lodash');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

      this.log(_chalk2.default.blue('\nNow we will go through the Bot class creation prompt:\n'));

      // because can't feed answers into the inquirer prompt using tests
      var promptInterface = process.env.NODE_ENV === 'test' ? this.prompt.bind(this) : _inquirer2.default.prompt;

      var promptArray = this._buildPromptArray();
      return promptInterface(promptArray).then(function (answers) {
        (0, _lodash.merge)(_this2.options, answers);
      });
    }
  }, {
    key: '_buildPromptArray',
    value: function _buildPromptArray() {
      var promptArray = [];
      var botClassNamePrompt = {
        type: 'input',
        name: 'botClassName',
        message: 'How will your bot class be called?',
        default: BotClassGenerator._createDefaultBotClassName(this.appname)
      };

      var requiresWebhookPrompt = {
        type: 'confirm',
        name: 'requiresWebhook',
        message: 'Will your bot class make the use of webhooks?',
        default: false
      };

      var codeStylePrompt = {
        type: 'list',
        name: 'codeStyle',
        message: 'What code style will you be writing your code in?',
        choices: [{
          name: 'I will be writing my code in ComonJS (i.e. pick this if you aren\'t using Babel to transpile your code)',
          value: 'CommonJS'
        }, {
          name: 'I will be writing my code in ES2017',
          value: 'ES2017'
        }],
        default: 'CommonJS'
      };

      promptArray.push(botClassNamePrompt);
      promptArray.push(requiresWebhookPrompt);
      promptArray.push(codeStylePrompt);

      return promptArray;
    }
  }, {
    key: 'paths',
    value: function paths() {
      this.sourceRoot(_path2.default.join(__dirname, '../../../../templates'));
    }
  }, {
    key: 'writing',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var botClassName, destinationPath, botClassTemplate;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                botClassName = this.options.botClassName;
                destinationPath = void 0;

                if (!this.options.standalone) {
                  _context.next = 6;
                  break;
                }

                destinationPath = (0, _lodash.snakeCase)(botClassName) + '.js';
                _context.next = 11;
                break;

              case 6:
                _context.next = 8;
                return _fsPromise2.default.mkdir('./src');

              case 8:
                _context.next = 10;
                return _fsPromise2.default.mkdir('./src/lib');

              case 10:
                destinationPath = 'src/lib/' + (0, _lodash.snakeCase)(botClassName) + '.js';

              case 11:
                _context.next = 13;
                return this._getBotClassTemplate();

              case 13:
                botClassTemplate = _context.sent;
                _context.next = 16;
                return _fsPromise2.default.writeFile(destinationPath, botClassTemplate);

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function writing() {
        return _ref.apply(this, arguments);
      }

      return writing;
    }()
  }, {
    key: '_getBotClassTemplate',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var botClassName, botType, bufferBaseTemplate, baseTemplate, $, botClassNameElements, botTypeElements, wantedCodeStyleElements, unwantedCodeStyleElements, requiresWebHookElements;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                botClassName = this.options.botClassName;
                botType = this.options.botClassName.toLowerCase().replace('bot', '');
                _context2.next = 4;
                return _fsPromise2.default.readFile(_path2.default.join(this.sourceRoot(), 'bot_class_template.xml'));

              case 4:
                bufferBaseTemplate = _context2.sent;
                baseTemplate = bufferBaseTemplate.toString();
                $ = _cheerio2.default.load(baseTemplate);

                // replace bot-class-name

                botClassNameElements = $('bot-class-name');

                botClassNameElements.replaceWith(botClassName);

                // replace bot-type
                botTypeElements = $('bot-type');

                botTypeElements.replaceWith(botType);

                // Clean up the codeStyle lines we do need
                wantedCodeStyleElements = $('.' + this.options.codeStyle);


                wantedCodeStyleElements.map(function (index, element) {
                  var elementText = $(element).text();
                  $(element).replaceWith(elementText);
                });

                // remove the ones we don't need!
                unwantedCodeStyleElements = $('.codeStyle');

                unwantedCodeStyleElements.remove();

                // deal with requireWebHook botTypeElements
                requiresWebHookElements = $('.requires-webhook');

                if (!this.options.requiresWebhook) {
                  requiresWebHookElements.remove();
                }

                return _context2.abrupt('return', $('main').text());

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _getBotClassTemplate() {
        return _ref2.apply(this, arguments);
      }

      return _getBotClassTemplate;
    }()
  }, {
    key: 'install',
    value: function install() {
      // console.log(this.options);
      if (this.options['skip-install']) {
        return;
      }

      this.log(_chalk2.default.blue('Installing botmaster!'));

      this.spawnCommand('npm', ['install']);
      this.npmInstall(['botmaster'], { save: true });
    }
  }, {
    key: 'end',
    value: function end() {
      this.log(_chalk2.default.green('Successfully setup your botclass. You can now hack away at it.'));
      this.log(_chalk2.default.blue('\nRead more about how to write bot classes at: http://botmasterai.com/working-with-botmaster/writing-your-own-bot-class/'));
    }
  }], [{
    key: '_createDefaultBotClassName',
    value: function _createDefaultBotClassName(folderName) {
      var folderNameWithoutBotmaster = folderName.toLowerCase().replace('botmaster', '');
      var folderNameEndingWithBot = folderNameWithoutBotmaster.endsWith('bot') ? folderNameWithoutBotmaster : folderNameWithoutBotmaster + '-bot';

      return (0, _lodash.upperFirst)((0, _lodash.camelCase)(folderNameEndingWithBot));
    }
  }]);
  return BotClassGenerator;
}(_yeomanGenerator2.default);

module.exports = BotClassGenerator;