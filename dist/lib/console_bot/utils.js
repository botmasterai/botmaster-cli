'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chalk = require('chalk');

// function adapted to the console from: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
function syntaxHighlight(json) {
  var typeColorMatch = {
    number: 'cyan',
    key: 'red',
    string: 'green',
    boolean: 'blue',
    null: 'magenta'
  };

  var highlightedJson = void 0;

  if (typeof json != 'string') {
    highlightedJson = (0, _stringify2.default)(json, undefined, 2);
  }

  highlightedJson = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return highlightedJson.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var type = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        type = 'key';
      } else {
        type = 'string';
      }
    } else if (/true|false/.test(match)) {
      type = 'boolean';
    } else if (/null/.test(match)) {
      type = 'null';
    }
    return chalk[typeColorMatch[type]](match);
  });
}

module.exports = {
  syntaxHighlight: syntaxHighlight
};