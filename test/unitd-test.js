/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute, fail;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;
	fail = buster.assertions.fail;

	define('unitd-test', function (require) {

		var unitd = require('unitd');

		buster.testCase('unitd', {
			'exists': function () {
				assert(unitd);
			},
			'operations': {
				'add': function () {
					var add = unitd.operations.getOperations().add;
					assert.same(add(3, 5), 8);
					assert.same(add(3, -2), 1);
				},
				'subtract': function () {
					var subtract = unitd.operations.getOperations().subtract;
					assert.same(subtract(3, 5), -2);
					assert.same(subtract(3, -2), 5);
				},
				'multiply': function () {
					var multiply = unitd.operations.getOperations().multiply;
					assert.same(multiply(3, 5), 15);
					assert.same(multiply(3, -2), -6);
				},
				'divide': function () {
					var divide = unitd.operations.getOperations().divide;
					assert.same(divide(3, 5), 0.6);
					assert.same(divide(3, -2), -1.5);
				}
			},
			'Measure': {
				'val': function () {
					assert.same(new unitd.Measure(3).val(), 3);
				},
				'ctor': {
					'Measure': function () {
						var num = new unitd.Measure(3);
						assert.same(new unitd.Measure(num).val(), 3);
					},
					'Number': function () {
						var num = Number(3);
						assert.same(new unitd.Measure(num).val(), 3);
					},
					'number': function () {
						var num = 3;
						assert.same(new unitd.Measure(num).val(), 3);
					},
					'string': function () {
						var num = '3';
						assert.same(new unitd.Measure(num).val(), 3);
					},
					'String': function () {
						var num = String('3');
						assert.same(new unitd.Measure(num).val(), 3);
					},
					'Object': function () {
						var num = { toString: function () { return '3'; } };
						assert.same(new unitd.Measure(num).val(), 3);
					},
					'undefined': function () {
						var num;
						try {
							num = new unitd.Measure(num);
							fail('Error expected');
						}
						catch (e) {
							assert(e instanceof Error);
							assert.match(e.message, 'A number is required');
						}
					},
					'NaN': function () {
						var num = NaN;
						try {
							num = new unitd.Measure(num);
							fail('Error expected');
						}
						catch (e) {
							assert(e instanceof Error);
							assert.match(e.message, 'A number is required');
						}
					}
				},
				'operation': {
					'add': function () {
						var a = new unitd.Measure(3),
						    b = new unitd.Measure(5),
						    sum = a.add(b);
						assert(sum instanceof unitd.Measure);
						assert.same(sum.val(), 8);
					},
					'chain': function () {
						var num = new unitd.Measure(4).add(3).multiply(4).divide(2).subtract(1);
						assert.same(num.val(), 13);
					}
				}
			}
		});

	});

}(
	this.buster || require('buster'),
	typeof define === 'function' && define.amd ? define : function (id, factory) {
		var packageName = id.split(/[\/\-]/)[0], pathToRoot = id.replace(/[^\/]+/g, '..');
		pathToRoot = pathToRoot.length > 2 ? pathToRoot.substr(3) : pathToRoot;
		factory(function (moduleId) {
			return require(moduleId.indexOf(packageName) === 0 ? pathToRoot + moduleId.substr(packageName.length) : moduleId);
		});
	}
	// Boilerplate for AMD and Node
));
