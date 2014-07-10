var wrapCallback,
    timeThat = require('timethat');

/**
 * @module wrapCallback
 */
/**
 * @class wrapCallback
 */

/**
 * Wrap a callback function to add timing and logging asyncronous calls
 * @method wrap
 * @param  {Object}     config          Configuration for the logging and callback
 *     @param {Object}  config.context  Context to run the callback function in (default: null)
 *     @param {Object}  config.logger   Logging utility with a warn method (default: console)
 *     @param {Number}  config.max_time_warning   Time in ms to determine if a call is too slow. Will not log if call is faster. Will always log if 0. (default: 0)
 *     @param {Array|String}  config.tag    Value to show in [] before log message. (default: '')
 *     @param {String}  config.methodName   Name of the method to display in the log (default: '')
 * @param  {Function}   callback        Function to wrap
 * @return {Function}   Wrapped Callback
 */
function wrapCallback(config, callback) {
    if (!callback) {
        callback = config;
        config = {};
    }
    if (!callback || typeof callback !== 'function') {
        throw new Error('Callback not defined');
    }

    var start = new Date(),
        context = config.context || null,
        logger = config.logger || console,
        max_time_warning = config.max_time_warning || 0,
        tag = Array.isArray(config.tag) ? config.tag.join(' ') : config.tag,
        methodName = config.methodName;

    return function () {
        var now = new Date(),
            isTooSlow = (now.getTime() - start.getTime() > max_time_warning),
            message = [];

        if (tag) {
            message.push('[', tag, '] ');
        }
        message.push('Call ');
        if (methodName) {
            message.push('(', methodName, ') ');
        }
        message.push('took ');
        if (max_time_warning) {
            message.push('longer than ', max_time_warning / 1000, ' seconds - ');
        }
        message.push(timeThat.calc(start, now));

        if (!max_time_warning || (max_time_warning && isTooSlow)) {
            logger.warn(message.join(''));
        }
        // @note arguments refers to THIS closure not wrapCallback
        callback.apply(context, arguments);
    };
}

module.exports = {
    wrap: wrapCallback
};
