/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

    // EMCAScript requires at least between 1 and 21 digits of precision.
    // Some implementations may exceed this range
    // TODO should we test for precision limits?
    var MAX_PRECISION = 21,
        MIN_PRECISION = 1;

	define(function () {

        function Operations() {
            var ops = {},
                listeners = [];

            this.register = function register(name, func) {
                if (ops.hasOwnProperty(name)) {
                    throw new Error('Operation [' + name + '] is already registered');
                }
                ops[name] = func;
                listeners.forEach(function (listener) {
                    listener(name, func);
                });
            };

            this.onRegister = function onRegister(listener) {
                listeners.push(listener);
            };

            this.getOperations = function getOperations() {
                // TODO clone to protect from side effects
                return ops;
            };
        }

        function Measure(value, precision) {
            if (value instanceof Measure) {
                precision = value.precision();
                value = value.raw();
            }
            else {
                if (typeof precision !== 'number') {
                    // TODO should we infer precision from value
                    precision = Number(precision).valueOf();
                }
                if (isNaN(precision)) {
                    precision = MAX_PRECISION;
                }

                if (typeof value !== 'number') {
                    value = Number(value).valueOf();
                }
                if (isNaN(value)) {
                    // TODO use non-coerced value in error message
                    throw new Error('A number is required, found [' + value + ']');
                }

                precision = Math.max(Math.min(precision, MAX_PRECISION), MIN_PRECISION);
            }

            this.val = function () {
                // TODO there's probably a more efficient way to drop precision
                return Number(value.toPrecision(precision));
            };
            this.raw = function () {
                return value;
            };
            this.precision = function () {
                return precision;
            };
        }

        var operations = new Operations();

        // automatically add operation to Measure instances
        operations.onRegister(function (name, func) {
            Measure.prototype[name] = function (measure) {
                if (!(measure instanceof Measure)) {
                    measure = new Measure(measure);
                }
                return new Measure(func(this.raw(), measure.raw()), Math.min(this.precision(), measure.precision()));
            };
        });

        // register basic math operations
        operations.register('add',      function (a, b) { return a + b; });
        operations.register('subtract', function (a, b) { return a - b; });
        operations.register('multiply', function (a, b) { return a * b; });
        operations.register('divide',   function (a, b) { return a / b; });

		return {
            Measure: Measure,
            operations: operations
        };

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
