/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

    // EMCAScript requires at least between 1 and 21 digits of precision.
    // We drop the limit to 15 digits to avoid floating point rounding issues.
    var MAX_PRECISION = 15,
        MIN_PRECISION = 1,
        undef;

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

        function Measure(value, unit, precision) {
            if (value instanceof Measure) {
                return value;
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

                unit = unit || Unit.Reserved.NonUnited;
                precision = Math.max(Math.min(precision, MAX_PRECISION), MIN_PRECISION);
            }

            // TODO there's probably a more efficient way to drop precision
            this.val = Number(value.toPrecision(precision));
            this.raw = value;
            this.unit = unit;
            this.precision = precision;
        }

        Measure.prototype.as = function as(unit) {
            if (!(unit instanceof Unit)) {
                // lookup unit
                unit = Unit[this.unit.type][unit];
                if (!unit) {
                    throw new Error('Unable to find unit [' + arguments[0] + ']');
                }
            }
            if (!this.unit.isComparable(unit)) {
                throw new Error('Unit ' + this.unit + ' is not comparable to ' + unit);
            }
            return new Measure(this.raw * this.unit.scale / unit.scale, unit, this.precision);
        };

        function Unit() { throw new Error('Unit is not constructable'); }
        Object.defineProperty(Unit, 'prototype', { value: Unit.prototype });
        Unit.register = function register(type, name, abbr, scale) {
            /*jslint evil: true */
            var validNameRE = /^[A-Z][a-zA-Z0-9]*$/;
            if (!validNameRE.test(type)) {
                throw new Error('Type must be a camel case identifier [' + type + ']');
            }
            if (!validNameRE.test(name)) {
                throw new Error('Name must be a camel case identifier [' + name + ']');
            }

            if (!Unit[type]) {
                // define unit type
                Object.defineProperty(Unit, type, { enumerable: true, value: eval('(function ' + type + '() { throw new Error(\'' + type + ' is not constructable\') })') });
                Unit[type].prototype = Object.create(Unit.prototype);
                Object.defineProperties(Unit[type].prototype, {
                    isComparable: { value: function (other) { return other instanceof Unit[type]; } }
                });
                Object.defineProperty(Unit[type], 'property', { value: Unit[type].prototype });
            }
            if (Unit[type][name]) {
                throw new Error('Unit already exists [' + type + '][' + name + ']');
            }

            // define unit
            Object.defineProperty(Unit[type], name, { enumerable: true, value: Object.create(Unit[type].prototype) });
            Object.defineProperties(Unit[type][name], {
                name: { enumerable: true, value: name },
                type: { enumerable: true, value: type },
                abbr: { enumerable: true, value: abbr },
                scale: { enumerable: true, value: scale },
                toString: { value: function () { return name; } }
            });
        };


        var operations = new Operations();

        // automatically add operation to Measure instances
        operations.onRegister(function (name, operation) {
            Measure.prototype[name] = function (measure, unit) {
                if (!(measure instanceof Measure)) {
                    measure = new Measure(measure, unit);
                }
                if (this.unit === undef && measure.unit === undef) {
                    // ok
                    console.log('hello');
                }
                else if (this.unit === undef || !this.unit.isComparable(measure.unit)) {
                    throw new Error('Unit ' + this.unit + ' is not comparable to ' + measure.unit);
                }
                return new Measure(
                    operation(this.raw * this.unit.scale, measure.raw * measure.unit.scale) / this.unit.scale,
                    this.unit,
                    Math.min(this.precision, measure.precision)
                );
            };
        });

        // define basic units
        Unit.register('Reserved', 'NonUnited', '', 1);
        Unit.register('Amount', 'Count', '', 1);
        Unit.register('Amount', 'Mole', 'mol', 1);
        Unit.register('Distance', 'AstronomicalUnit', 'au', 149597870700);
        Unit.register('Distance', 'Kilometer',        'km',         1000      );
        Unit.register('Distance', 'Meter',            'm',             1      );
        Unit.register('Distance', 'Millimeter',       'mm',            0.001  );
        Unit.register('Distance', 'Mile',             'mi',         1609.344  );
        Unit.register('Distance', 'Yard',             'yd',            0.9144 );
        Unit.register('Distance', 'Foot',             'ft',            0.30480);
        Unit.register('Distance', 'Inch',             'in',            0.0254 );
        Unit.register('Time', 'Day',    'd',  86400);
        Unit.register('Time', 'Hour',   'hr',  3600);
        Unit.register('Time', 'Minute', 'm',     60);
        Unit.register('Time', 'Second', 's',      1);


        // register basic math operations
        operations.register('add',      function (a, b) { return a + b; });
        operations.register('subtract', function (a, b) { return a - b; });
        operations.register('multiply', function (a, b) { return a * b; });
        operations.register('divide',   function (a, b) { return a / b; });

		return {
            Measure: Measure,
            Unit: Unit,
            operations: operations
        };

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
