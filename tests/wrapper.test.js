/*
 * Copyright (c) 2011 Yahoo! Inc. All rights reserved.
 */
const { assert } = require('chai');
const { wrap } = require('../index');

const assertableCallback = (done) => (num, str, str2) => {
  assert.equal(1, num);
  assert.equal('foo', str);
  assert.equal('hello', str2);
  done();
};

const getLogger = (message) => ({
  warn: (str) => {
    assert.isTrue(str.indexOf(message) === 0, `Log message did not match. Expected "${str}" to match "${message}"`);
  },
});

/* eslint-env mocha */
/* eslint-disable func-names */
describe('callback-timer', () => {
  it('should fail if the user is stupid', () => {
    try {
      wrap();
      assert.fail('should have thrown an error');
    } catch (err) {
      assert.equal('Callback not defined', err.message);
    }
    try {
      wrap('foo');
      assert.fail('should have thrown an error');
    } catch (err) {
      assert.equal('Callback not defined', err.message);
    }
  });

  it('should wrap a callback object', function (done) {
    this.timeout(1);
    const cb = assertableCallback(done);
    const callback = wrap(cb);

    callback(1, 'foo', 'hello');
  });

  it('should accept a custom logger', function (done) {
    this.timeout(1);
    const cb = assertableCallback(done);
    const callback = wrap({
      logger: getLogger('Call took '),
    }, cb);

    callback(1, 'foo', 'hello');
  });

  it('should accept a tag', function (done) {
    this.timeout(1);
    const cb = assertableCallback(done);
    const callback = wrap({
      tag: 'foo',
      logger: getLogger('[foo] Call took '),
    }, cb);

    callback(1, 'foo', 'hello');
  });

  it('should accept a tag array', function (done) {
    this.timeout(1);
    const cb = assertableCallback(done);
    const callback = wrap({
      tag: ['foo', 'bar'],
      logger: getLogger('[foo bar] Call took '),
    }, cb);

    callback(1, 'foo', 'hello');
  });

  it('should accept a maxTimeWarning for determining call length', function (done) {
    this.timeout(30);
    const cb = assertableCallback(done);
    const callback = wrap({
      maxTimeWarning: 20,
      tag: 'foo',
      logger: getLogger('[foo] Call took longer than 0.02 seconds - '),
    }, cb);

    callback(1, 'foo', 'hello');
  });

  it('should accept a method name to determine what the callback was for', function (done) {
    this.timeout(1);
    const cb = assertableCallback(done);
    const callback = wrap({
      methodName: 'banana',
      tag: 'foo',
      logger: getLogger('[foo] Call (banana) took '),
    }, cb);

    callback(1, 'foo', 'hello');
  });

  it('should not warn if maxTimeWarning and call was fast', function (done) {
    this.timeout(1);
    const cb = assertableCallback(done);
    const callback = wrap({
      methodName: 'banana',
      maxTimeWarning: 20,
      tag: 'foo',
      logger: {
        warn() {
          assert.fail('should not call the logger');
        },
      },
    }, cb);

    callback(1, 'foo', 'hello');
  });

  it('should accept useRelativeTime', function (done) {
    this.timeout(1);
    const cb = (num, str) => {
      assert.equal(1, num);
      assert.equal('foo', str);
      done();
    };
    const callback = wrap({
      logger: getLogger('Call took '),
      useRelativeTime: false,
    }, cb);

    callback(1, 'foo');
  });
});
