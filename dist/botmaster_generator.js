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

var R = require('ramda');
var Generator = require('yeoman-generator');

var BotmasterGenerator = function (_Generator) {
  (0, _inherits3.default)(BotmasterGenerator, _Generator);

  function BotmasterGenerator() {
    (0, _classCallCheck3.default)(this, BotmasterGenerator);
    return (0, _possibleConstructorReturn3.default)(this, (BotmasterGenerator.__proto__ || (0, _getPrototypeOf2.default)(BotmasterGenerator)).apply(this, arguments));
  }

  (0, _createClass3.default)(BotmasterGenerator, [{
    key: 'initializing',
    value: function initializing() {}
  }, {
    key: 'prompting',
    value: function prompting() {
      var _this2 = this;

      var promptArray = this._buildPromptArray();
      return this.prompt(promptArray).then(function (answers) {
        _this2.options.platforms = answers.platforms ? answers.platforms : _this2.options.platforms;
        _this2._parsePlatformNames();
      });
    }
  }, {
    key: '_buildPromptArray',
    value: function _buildPromptArray() {
      var promptArray = [];
      var platformPrompt = {
        type: 'input',
        name: 'platforms',
        message: 'Which platforms would you like to support?',
        default: 'socketio, messenger'
      };
      if (!this.options.platforms) {
        promptArray.push(platformPrompt);
      }

      return promptArray;
    }
  }, {
    key: '_parsePlatformNames',
    value: function _parsePlatformNames() {
      if (!this.options.platforms) {
        return;
      }
      // create platforms names array
      var platforms = R.split(/[,]|\s/, this.options.platforms);
      // remove any dots (for socket.io for instance)
      platforms = R.map(R.replace('.', ''), platforms);
      // remove empty entries due to using space and commas.
      var isEmptyString = function isEmptyString(str) {
        return str !== '';
      };
      platforms = R.filter(isEmptyString, platforms);

      this.options.platforms = platforms;
    }
  }, {
    key: 'method2',
    value: function method2() {
      this.log(this.options.platforms);
    }
  }]);
  return BotmasterGenerator;
}(Generator);

module.exports = BotmasterGenerator;