import test from 'ava';
import { extractUrlFromArgv } from '../dist/lib/utils';

const extractUrlFromArgvMacro = (t, argv, expectedUrl) => {
  t.is(extractUrlFromArgv(argv), expectedUrl);
};

extractUrlFromArgvMacro.title = (providedTitle, argv, expectedUrl) =>
  `Calling extractUrlFromArgv with ${JSON.stringify(argv)} should return ${expectedUrl}`.trim();

test(extractUrlFromArgvMacro, {}, 'ws://localhost:3000');
test(extractUrlFromArgvMacro, { host: 'example.com' }, 'ws://example.com');
test(extractUrlFromArgvMacro, {
  host: 'http://example.com',
}, 'ws://example.com');
test(extractUrlFromArgvMacro, {
  host: 'https://example.com',
}, 'wss://example.com');
test(extractUrlFromArgvMacro, {
  host: 'https://example.com',
  port: 6000,
}, 'wss://example.com:6000');
test(extractUrlFromArgvMacro, {
  host: 'example.com',
  port: 6000,
}, 'ws://example.com:6000');
test(extractUrlFromArgvMacro, {
  host: 'example.com',
  port: 6000,
  botmasterUserId: 'some_id',
}, 'ws://example.com:6000?botmasterUserId=some_id');
test(extractUrlFromArgvMacro, {
  host: 'example.com/',
  port: 6000,
  botmasterUserId: 'some_id',
}, 'ws://example.com:6000?botmasterUserId=some_id');
test(extractUrlFromArgvMacro, {
  host: 'example.com/',
  botmasterUserId: 'some_id',
}, 'ws://example.com?botmasterUserId=some_id');
