'use strict';
// writing this in CommonJS, as ava does not transpile code that
// does not contain a test in it
const path = require('path');
const helpers = require('yeoman-test');
const snakeCase = require('lodash').snakeCase;

function simulateRunningGenerator(generatorName, opts, prompts, pre) {
  let dirPath;

  return new Promise((resolve) => {
    helpers.run(path.join(__dirname, `../../dist/lib/generators/${snakeCase(generatorName)}`))
      .inTmpDir((dir) => {
        if (pre) {
          pre(dir);
        }
        dirPath = dir;
        // basename = path.basename(dir);
      })
      .withOptions(opts || {})
      .withPrompts(prompts || {})
      .on('end', () => resolve(dirPath));
  });
}

module.exports = {
  simulateRunningGenerator,
};
