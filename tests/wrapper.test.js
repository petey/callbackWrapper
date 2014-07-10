/*
 * Copyright (c) 2011 Yahoo! Inc. All rights reserved.
 */
/*jslint nomen: true */
var Y = require('yuitest'),
    A = Y.Assert,
    wrap = require('../index').wrap;

Y.TestRunner.add(new Y.TestCase({

    name : 'wrapper test case',

    getLogger: function (message) {
        return {
            warn: function (str) {
                A.isTrue(str.indexOf(message) === 0, 'Log message did not match. Expected "' + str + '" to match "' + message + '"');
            }
        };
    },

    "should fail if the user is stupid": function () {
        try {
            wrap();
            A.fail('should have thrown an error');
        } catch (err) {
            A.areEqual('Callback not defined', err.message);
        }
        try {
            wrap("foo");
            A.fail('should have thrown an error');
        } catch (err) {
            A.areEqual('Callback not defined', err.message);
        }
    },
    "should wrap a callback object": function () {
        var cb = function (num, str, str2) {
                A.areEqual(1, num);
                A.areEqual("foo", str);
                A.areEqual("hello", str2);
            },
            callback = wrap(cb);

        this.wait(function () {
            callback(1, "foo", "hello");
        }, 1);
    },
    "should accept a custom logger": function () {
        var cb = function (num, str, str2) {
                A.areEqual(1, num);
                A.areEqual("foo", str);
                A.areEqual("hello", str2);
            },
            callback = wrap({
                logger: this.getLogger('Call took ')
            }, cb);

        this.wait(function () {
            callback(1, "foo", "hello");
        }, 1);
    },
    "should accept a tag": function () {
        var cb = function (num, str, str2) {
                A.areEqual(1, num);
                A.areEqual("foo", str);
                A.areEqual("hello", str2);
            },
            callback = wrap({
                tag: 'foo',
                logger: this.getLogger('[foo] Call took ')
            }, cb);

        this.wait(function () {
            callback(1, "foo", "hello");
        }, 1);
    },
    "should accept a tag array": function () {
        var cb = function (num, str, str2) {
                A.areEqual(1, num);
                A.areEqual("foo", str);
                A.areEqual("hello", str2);
            },
            callback = wrap({
                tag: ['foo', 'bar'],
                logger: this.getLogger('[foo bar] Call took ')
            }, cb);

        this.wait(function () {
            callback(1, "foo", "hello");
        }, 1);
    },
    "should accept a max_time_warning for determining call length": function () {
        var cb = function (num, str, str2) {
                A.areEqual(1, num);
                A.areEqual("foo", str);
                A.areEqual("hello", str2);
            },
            callback = wrap({
                max_time_warning: 20,
                tag: 'foo',
                logger: this.getLogger('[foo] Call took longer than 0.02 seconds - ')
            }, cb);

        this.wait(function () {
            callback(1, "foo", "hello");
        }, 30);
    },
    "should accept a method name to determine what the callback was for": function () {
        var cb = function (num, str, str2) {
                A.areEqual(1, num);
                A.areEqual("foo", str);
                A.areEqual("hello", str2);
            },
            callback = wrap({
                methodName: 'banana',
                tag: 'foo',
                logger: this.getLogger('[foo] Call (banana) took ')
            }, cb);

        this.wait(function () {
            callback(1, "foo", "hello");
        }, 1);
    },
    "should not warn if max_time_warning and call was fast": function () {
        var cb = function (num, str, str2) {
                A.areEqual(1, num);
                A.areEqual("foo", str);
                A.areEqual("hello", str2);
            },
            callback = wrap({
                methodName: 'banana',
                max_time_warning: 20,
                tag: 'foo',
                logger: {
                    warn: function () {
                        A.fail('should not call the logger');
                    }
                }
            }, cb);

        this.wait(function () {
            callback(1, "foo", "hello");
        }, 1);
    },

}));
