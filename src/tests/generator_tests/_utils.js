const path = require('path');
const helpers = require('yeoman-test');

function runGenerator(generatorName, prompts, opts, pre) {
  let basename;

  return new Promise((resolve) => {
    helpers.run(path.join(__dirname, `../../lib/${generatorName}`))
      .inTmpDir((dir) => {
        if (pre) {
          pre(dir);
        }
        basename = path.basename(dir);
      })
      .withOptions(opts || {})
      .withPrompts(prompts || {})
      .on('end', () => resolve(basename));
  });
}

module.exports = {
  runGenerator,
};
