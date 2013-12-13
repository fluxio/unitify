/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute, fail, undef;

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
					assert.same(new unitd.Measure(3).raw, 3);
				},
				'precision': function () {
					assert.same(new unitd.Measure(3, undef, 2).precision, 2);

					// precision is bounded between 1 and 21
					assert.same(new unitd.Measure(3).precision, 15);
					assert.same(new unitd.Measure(3, undef, 100).precision, 15);
					assert.same(new unitd.Measure(3, undef, -100).precision, 1);
				},
				'val': function () {
					assert.same(new unitd.Measure(987654321.01234, undef,  1).val, 1000000000);
					assert.same(new unitd.Measure(987654321.01234, undef,  2).val, 990000000);
					assert.same(new unitd.Measure(987654321.01234, undef,  3).val, 988000000);
					assert.same(new unitd.Measure(987654321.01234, undef,  4).val, 987700000);
					assert.same(new unitd.Measure(987654321.01234, undef,  5).val, 987650000);
					assert.same(new unitd.Measure(987654321.01234, undef,  6).val, 987654000);
					assert.same(new unitd.Measure(987654321.01234, undef,  7).val, 987654300);
					assert.same(new unitd.Measure(987654321.01234, undef,  8).val, 987654320);
					assert.same(new unitd.Measure(987654321.01234, undef,  9).val, 987654321);
					assert.same(new unitd.Measure(987654321.01234, undef, 10).val, 987654321.0);
					assert.same(new unitd.Measure(987654321.01234, undef, 11).val, 987654321.01);
					assert.same(new unitd.Measure(987654321.01234, undef, 12).val, 987654321.012);
					assert.same(new unitd.Measure(987654321.01234, undef, 13).val, 987654321.0123);
					assert.same(new unitd.Measure(987654321.01234, undef, 14).val, 987654321.01234);
					assert.same(new unitd.Measure(987654321.01234, undef, 15).val, 987654321.01234);
				},
				'ctor': {
					'Measure': function () {
						var num = new unitd.Measure(3);
						assert.same(new unitd.Measure(num).raw, 3);
					},
					'Number': function () {
						var num = Number(3);
						assert.same(new unitd.Measure(num).raw, 3);
					},
					'number': function () {
						var num = 3;
						assert.same(new unitd.Measure(num).raw, 3);
					},
					'string': function () {
						var num = '3';
						assert.same(new unitd.Measure(num).raw, 3);
					},
					'String': function () {
						var num = String('3');
						assert.same(new unitd.Measure(num).raw, 3);
					},
					'Object': function () {
						var num = { toString: function () { return '3'; } };
						assert.same(new unitd.Measure(num).raw, 3);
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
						assert.same(sum.raw, 8);
					},
					'chain': function () {
						var num = new unitd.Measure(4).add(3).multiply(4).divide(2).subtract(1);
						assert.same(num.val, 13);
					},
					'chained precision': function () {
						var num = new unitd.Measure(4).add(3).multiply(4).divide(new unitd.Measure(2, undef, 1)).subtract(1);
						assert.same(num.val, 10);
					},
					'with same units': function () {
						var a = new unitd.Measure(3, unitd.Unit.Distance.Meter),
						    b = new unitd.Measure(5, unitd.Unit.Distance.Meter),
						    sum = a.add(b);
						assert.same(sum.raw, 8);
						assert.same(sum.unit, unitd.Unit.Distance.Meter);
					},
					'with comparable units': function () {
						var a = new unitd.Measure(3, unitd.Unit.Distance.Kilometer),
						    b = new unitd.Measure(5000, unitd.Unit.Distance.Meter),
						    sum = a.add(b),
						    communitiveSum = b.add(a);
						assert.same(sum.raw, 8);
						assert.same(sum.unit, unitd.Unit.Distance.Kilometer);
						assert.same(communitiveSum.raw, 8000);
						assert.same(communitiveSum.unit, unitd.Unit.Distance.Meter);
					},
					'with incomparable units': function () {
						var a = new unitd.Measure(3, unitd.Unit.Distance.Meter),
						    b = new unitd.Measure(5, unitd.Unit.Amount.Count);
						try {
							a.add(b);
							fail('Exception expected');
						}
						catch (e) {
							assert(e instanceof Error);
							assert.match(e.message, '');
						}
					}
				},
				'as': {
					'comparable unit': function () {
						assert.same(new unitd.Measure(3, unitd.Unit.Distance.Foot).as('Inch').val, 36);
					},
					'unknown unit': function () {
						try {
							new unitd.Measure(3, unitd.Unit.Distance.Foot).as('Minute');
							fail('Exception expected');
						}
						catch (e) {
							assert(e instanceof Error);
							assert.match(e.message, 'Unable to find unit [Minute]');
						}
					},
					'incomparable unit': function () {
						try {
							new unitd.Measure(3, unitd.Unit.Distance.Foot).as(unitd.Unit.Time.Minute);
							fail('Exception expected');
						}
						catch (e) {
							assert(e instanceof Error);
							assert.match(e.message, 'Unit Foot is not comparable to Minute');
						}
					}
				}
			},
			'units': {
				'distance': {
					'': function () {
						assert(Object.create(unitd.Unit.Distance.prototype) instanceof unitd.Unit);

						assert(unitd.Unit.Distance.Meter.isComparable(unitd.Unit.Distance.Kilometer));
						assert(unitd.Unit.Distance.Meter.isComparable(unitd.Unit.Distance.Millimeter));
						assert(unitd.Unit.Distance.Kilometer.isComparable(unitd.Unit.Distance.Meter));
						assert(unitd.Unit.Distance.Kilometer.isComparable(unitd.Unit.Distance.Millimeter));
						assert(unitd.Unit.Distance.Millimeter.isComparable(unitd.Unit.Distance.Kilometer));
						assert(unitd.Unit.Distance.Millimeter.isComparable(unitd.Unit.Distance.Meter));

						refute(unitd.Unit.Distance.Meter.isComparable(unitd.Unit.Amount.Count));
						refute(unitd.Unit.Distance.Kilometer.isComparable(unitd.Unit.Amount.Count));
						refute(unitd.Unit.Distance.Millimeter.isComparable(unitd.Unit.Amount.Count));
						refute(unitd.Unit.Amount.Count.isComparable(unitd.Unit.Distance.Meter));
						refute(unitd.Unit.Amount.Count.isComparable(unitd.Unit.Distance.Kilometer));
						refute(unitd.Unit.Amount.Count.isComparable(unitd.Unit.Distance.Millimeter));
					},
					'meters': function () {
						var unit = unitd.Unit.Distance.Meter;

						assert(unit instanceof unitd.Unit);
						assert(unit instanceof unitd.Unit.Distance);

						assert.same(unit.name, 'Meter');
						assert.same(unit.abbr, 'm');
						assert.same(unit.scale, 1);
					},
					'kilometers': function () {
						var unit = unitd.Unit.Distance.Kilometer;

						assert(unit instanceof unitd.Unit);
						assert(unit instanceof unitd.Unit.Distance);

						assert.same(unit.name, 'Kilometer');
						assert.same(unit.abbr, 'km');
						assert.same(unit.scale, 1000);
					},
					'millimeters': function () {
						var unit = unitd.Unit.Distance.Millimeter;

						assert(unit instanceof unitd.Unit);
						assert(unit instanceof unitd.Unit.Distance);

						assert.same(unit.name, 'Millimeter');
						assert.same(unit.abbr, 'mm');
						assert.same(unit.scale, 0.001);
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
