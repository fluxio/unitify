/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

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

        function Measure(value) {
            if (value instanceof Measure) {
                value = value.val();
            }
            else if (typeof value !== 'number') {
                value = Number(value).valueOf();
            }
            if (isNaN(value)) {
                // TODO use non-coerced value in error message
                throw new Error('A number is required, found [' + value + ']');
            }

            this.val = function val() {
                return value;
            };
        }

        var operations = new Operations();

        // automatically add operation to Measure instances
        operations.onRegister(function (name, func) {
            Measure.prototype[name] = function (num) {
                if (!(num instanceof Measure)) {
                    num = new Measure(num);
                }
                return new Measure(func(this.val(), num.val()));
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
