'use strict';

const chalk = require('chalk');

function extractUrlFromArgv(argv) {
  let host = argv.host;
  let port = argv.port;
  const botmasterUserId = argv.botmasterUserId;

  if (!host && !port) {
    host = 'localhost';
    port = 3000;
  } else if (!host && port) {
    host = 'localhost';
  }
  let cleanedHost = host;
  if (cleanedHost.indexOf('https://') === 0) {
    cleanedHost = host.replace('https://', 'wss://');
  } else if (cleanedHost.indexOf('http://') === 0) {
    cleanedHost = host.replace('http://', 'ws://');
  }
  // remove potential trailing slash
  if (cleanedHost[cleanedHost.length - 1] === '/') {
    cleanedHost = cleanedHost.slice(0, -1);
  }
  if (cleanedHost.indexOf('ws://') !== 0 &&
      cleanedHost.indexOf('wss://') !== 0) {
    cleanedHost = `ws://${cleanedHost}`;
  }
  let url = !port ? cleanedHost : `${cleanedHost}:${port}`;
  if (botmasterUserId && typeof botmasterUserId === 'string') {
    url += `?botmasterUserId=${botmasterUserId}`;
  }

  return url;
}

// function adapted to the console from: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
function syntaxHighlight(json) {
  const typeColorMatch = {
    number: 'cyan',
    key: 'red',
    string: 'green',
    boolean: 'blue',
    null: 'magenta',
  };

  let highlightedJson;

  if (typeof json != 'string') {
    highlightedJson = JSON.stringify(json, undefined, 2);
  }

  highlightedJson = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return highlightedJson.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let type = 'number';
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
  syntaxHighlight,
  extractUrlFromArgv,
};
