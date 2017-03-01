import test from 'ava';
import fsp from 'fs-promise';
import fs from 'fs';
import { snakeCase } from 'lodash';
import path from 'path';
import assert from 'yeoman-assert';
import { expect } from 'chai';
import { simulateRunningGenerator } from './_utils';
import BotClassGenerator from '../../dist/lib/generators/bot_class/bot_class_generator';

test('Standalone bot class creates file with wanted defaults', async (t) => { // eslint-disable-line
  const botClassName = 'TestBot';
  const botClassFileName = `${snakeCase(botClassName)}.js`;

  await simulateRunningGenerator(
    'botClass',
    {
      standalone: true,
      'skip-install': true,
    },
    {
      botClassName,
    },
  );

  const commonJSBotClassFile = await fsp.readFile(path.join(__dirname,
    '../expected_output/bot_class/standalone/_common_js_bot_class.js'));

  assert.noFile('package.json');
  assert.file(botClassFileName);
  assert.fileContent(botClassFileName, commonJSBotClassFile.toString());
});

test('Bot class created with ES2017 code style is as expected', async (t) => { // eslint-disable-line
  const botClassName = 'TestBot';
  const botClassFileName = `${snakeCase(botClassName)}.js`;

  await simulateRunningGenerator(
    'botClass',
    {
      standalone: true,
      'skip-install': true,
    },
    {
      botClassName,
      codeStyle: 'ES2017',
    },
  );

  const ES2017BotClassFile = await fsp.readFile(path.join(__dirname,
    '../expected_output/bot_class/standalone/_ES2017_bot_class.js'));

  assert.noFile('package.json');
  assert.file(botClassFileName);
  assert.fileContent(botClassFileName, ES2017BotClassFile.toString());
});

test('Bot class created that requires webhooks is as expected', async (t) => { // eslint-disable-line
  const botClassName = 'TestBot';
  const botClassFileName = `${snakeCase(botClassName)}.js`;

  await simulateRunningGenerator(
    'botClass',
    {
      standalone: true,
      'skip-install': true,
    },
    {
      botClassName,
      requiresWebhook: true,
    },
  );

  const requiresWebhookBotClassFile = await fsp.readFile(path.join(__dirname,
    '../expected_output/bot_class/standalone/_requires_webhook_bot_class.js'));

  assert.noFile('package.json');
  assert.file(botClassFileName);
  assert.fileContent(botClassFileName, requiresWebhookBotClassFile.toString());
});

test('when src folder already exists, don\'t try to recreate id', async (t) => { // eslint-disable-line
  const botClassName = 'TestBot';
  const botClassFileName = `./src/lib/${snakeCase(botClassName)}.js`;

  await simulateRunningGenerator(
    'botClass',
    {
      'skip-install': true,
    },
    {
      botClassName,
    },
    (dir) => {
      fs.mkdirSync('./src');
      fs.mkdirSync('./src/lib');
    },
  );

  assert.file('package.json');
  assert.file(botClassFileName);
});

test('When standalone option is not selected, correct folder structure and package.json are created', async (t) => {
  const botClassName = 'TestBot';
  const botClassFileName = `./src/lib/${snakeCase(botClassName)}.js`;
  const botType = botClassName.toLowerCase().replace('bot', '');

  const dir = await simulateRunningGenerator(
    'botClass',
    {
      'skip-install': false,
    },
    {
      name: `botmaster-${botType}`,
      description: 'lorem ipsum dolor',
      version: '9.9.9',
      main: 'app.js',
      repo: 'foo/bar',
      author: 'foobar',
      license: 'MIT',
      test: 'ava --verbose',
      botClassName,
    },
  );

  const commonJSBotClassFile = await fsp.readFile(path.join(__dirname,
    '../expected_output/bot_class/standalone/_common_js_bot_class.js'));

  const packageBuffer = await fsp.readFile(`${dir}/package.json`);
  const packageDotJSON = JSON.parse(packageBuffer);

  assert(packageDotJSON.dependencies.botmaster !== undefined);
  assert.fileContent(botClassFileName, commonJSBotClassFile.toString());
});

test('#_createDefaultBotClassName should give expected bot class name', () => {
  const folderName1 = 'botmaster_platform';
  expect(BotClassGenerator._createDefaultBotClassName(folderName1)).to.equal('PlatformBot');

  const folderName2 = 'platform-bot';
  expect(BotClassGenerator._createDefaultBotClassName(folderName2)).to.equal('PlatformBot');

  const folderName3 = 'some_platform-bot';
  expect(BotClassGenerator._createDefaultBotClassName(folderName3)).to.equal('SomePlatformBot');

  const folderName4 = 'some-platform';
  expect(BotClassGenerator._createDefaultBotClassName(folderName4)).to.equal('SomePlatformBot');

  const folderName5 = 'BotMaster-pLatform';
  expect(BotClassGenerator._createDefaultBotClassName(folderName5)).to.equal('PlatformBot');
});
