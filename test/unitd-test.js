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
				'raw': function () {
					assert.same(new unitd.Measure(3).raw(), 3);
				},
				'precision': function () {
					assert.same(new unitd.Measure(3, 2).precision(), 2);

					// precision is bounded between 1 and 21
					assert.same(new unitd.Measure(3).precision(), 21);
					assert.same(new unitd.Measure(3, 100).precision(), 21);
					assert.same(new unitd.Measure(3, -100).precision(), 1);
				},
				'val': function () {
					assert.same(new unitd.Measure(987654321.01234,  1).val(), 1000000000);
					assert.same(new unitd.Measure(987654321.01234,  2).val(), 990000000);
					assert.same(new unitd.Measure(987654321.01234,  3).val(), 988000000);
					assert.same(new unitd.Measure(987654321.01234,  4).val(), 987700000);
					assert.same(new unitd.Measure(987654321.01234,  5).val(), 987650000);
					assert.same(new unitd.Measure(987654321.01234,  6).val(), 987654000);
					assert.same(new unitd.Measure(987654321.01234,  7).val(), 987654300);
					assert.same(new unitd.Measure(987654321.01234,  8).val(), 987654320);
					assert.same(new unitd.Measure(987654321.01234,  9).val(), 987654321);
					assert.same(new unitd.Measure(987654321.01234, 10).val(), 987654321.0);
					assert.same(new unitd.Measure(987654321.01234, 11).val(), 987654321.01);
					assert.same(new unitd.Measure(987654321.01234, 12).val(), 987654321.012);
					assert.same(new unitd.Measure(987654321.01234, 13).val(), 987654321.0123);
					assert.same(new unitd.Measure(987654321.01234, 14).val(), 987654321.01234);
					assert.same(new unitd.Measure(987654321.01234, 15).val(), 987654321.01234);
				},
				'ctor': {
					'Measure': function () {
						var num = new unitd.Measure(3);
						assert.same(new unitd.Measure(num).raw(), 3);
					},
					'Number': function () {
						var num = Number(3);
						assert.same(new unitd.Measure(num).raw(), 3);
					},
					'number': function () {
						var num = 3;
						assert.same(new unitd.Measure(num).raw(), 3);
					},
					'string': function () {
						var num = '3';
						assert.same(new unitd.Measure(num).raw(), 3);
					},
					'String': function () {
						var num = String('3');
						assert.same(new unitd.Measure(num).raw(), 3);
					},
					'Object': function () {
						var num = { toString: function () { return '3'; } };
						assert.same(new unitd.Measure(num).raw(), 3);
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
						assert.same(sum.raw(), 8);
					},
					'chain': function () {
						var num = new unitd.Measure(4).add(3).multiply(4).divide(2).subtract(1);
						assert.same(num.val(), 13);
					},
					'chained precision': function () {
						var num = new unitd.Measure(4).add(3).multiply(4).divide(new unitd.Measure(2, 1)).subtract(1);
						assert.same(num.val(), 10);
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
