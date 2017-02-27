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

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var composedBotClassGenerator = function (_Generator) {
  (0, _inherits3.default)(composedBotClassGenerator, _Generator);

  function composedBotClassGenerator() {
    (0, _classCallCheck3.default)(this, composedBotClassGenerator);
    return (0, _possibleConstructorReturn3.default)(this, (composedBotClassGenerator.__proto__ || (0, _getPrototypeOf2.default)(composedBotClassGenerator)).apply(this, arguments));
  }

  (0, _createClass3.default)(composedBotClassGenerator, [{
    key: 'initializing',
    value: function initializing() {
      if (!this.options.standalone) {
        (0, _utils.printPreNPMInitPromptMessage)(this.log);
        this.composeWith(require.resolve('generator-npm-init/app'));
      }
      this.composeWith(require.resolve('./bot_class_generator'), this.options);
    }
  }]);
  return composedBotClassGenerator;
}(_yeomanGenerator2.default);

module.exports = composedBotClassGenerator;