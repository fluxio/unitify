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
                    assert.same(unitd(3).raw, 3);
                },
                'precision': function () {
                    assert.same(unitd(3, 2).precision, 2);

                    // precision is bounded between 1 and 21
                    assert.same(unitd(3).precision, 15);
                    assert.same(unitd(3, 100).precision, 15);
                    assert.same(unitd(3, -100).precision, 1);
                },
                'val': function () {
                    assert.same(unitd(987654321.01234,  1).val, 1000000000);
                    assert.same(unitd(987654321.01234,  2).val, 990000000);
                    assert.same(unitd(987654321.01234,  3).val, 988000000);
                    assert.same(unitd(987654321.01234,  4).val, 987700000);
                    assert.same(unitd(987654321.01234,  5).val, 987650000);
                    assert.same(unitd(987654321.01234,  6).val, 987654000);
                    assert.same(unitd(987654321.01234,  7).val, 987654300);
                    assert.same(unitd(987654321.01234,  8).val, 987654320);
                    assert.same(unitd(987654321.01234,  9).val, 987654321);
                    assert.same(unitd(987654321.01234, 10).val, 987654321.0);
                    assert.same(unitd(987654321.01234, 11).val, 987654321.01);
                    assert.same(unitd(987654321.01234, 12).val, 987654321.012);
                    assert.same(unitd(987654321.01234, 13).val, 987654321.0123);
                    assert.same(unitd(987654321.01234, 14).val, 987654321.01234);
                    assert.same(unitd(987654321.01234, 15).val, 987654321.01234);
                },
                'ctor': {
                    'Measure': function () {
                        var num = unitd(3);
                        assert.same(unitd(num).raw, 3);
                    },
                    'Number': function () {
                        var num = Number(3);
                        assert.same(unitd(num).raw, 3);
                    },
                    'number': function () {
                        var num = 3;
                        assert.same(unitd(num).raw, 3);
                    },
                    'string': function () {
                        var num = '3';
                        assert.same(unitd(num).raw, 3);
                    },
                    'String': function () {
                        var num = String('3');
                        assert.same(unitd(num).raw, 3);
                    },
                    'Object': function () {
                        var num = { toString: function () { return '3'; } };
                        assert.same(unitd(num).raw, 3);
                    },
                    'undefined': function () {
                        var num;
                        try {
                            num = unitd(num);
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
                            num = unitd(num);
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
                        var a = unitd(3),
                            b = unitd(5),
                            sum = a.add(b);
                        assert(sum instanceof unitd);
                        assert.same(sum.raw, 8);
                    },
                    'chain': function () {
                        var num = unitd(4).add(3).multiply(4).divide(2).subtract(1);
                        assert.same(num.val, 13);
                    },
                    'chained precision': function () {
                        var num = unitd(4).add(3).multiply(4).divide(2, 1).subtract(1);
                        assert.same(num.val, 10);
                    },
                    'with same units': function () {
                        var a = unitd(3, unitd.distance.meter),
                            b = unitd(5, unitd.distance.meter),
                            sum = a.add(b);
                        assert.same(sum.raw, 8);
                        assert.same(sum.unit, unitd.distance.meter);
                    },
                    'with comparable units': function () {
                        var a = unitd(3, unitd.distance.kilometer),
                            b = unitd(5000, unitd.distance.meter),
                            sum = a.add(b),
                            communitiveSum = b.add(a);
                        assert.same(sum.raw, 8);
                        assert.same(sum.unit, unitd.distance.kilometer);
                        assert.same(communitiveSum.raw, 8000);
                        assert.same(communitiveSum.unit, unitd.distance.meter);
                    },
                    'with incomparable units': function () {
                        var a = unitd(3, unitd.distance.meter),
                            b = unitd(5, unitd.amount.count);
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
                        assert.same(unitd(3, unitd.distance.foot).as('inch').val, 36);
                    },
                    'unknown unit': function () {
                        try {
                            unitd(3, unitd.distance.foot).as('minute');
                            fail('Exception expected');
                        }
                        catch (e) {
                            assert(e instanceof Error);
                            assert.match(e.message, 'Unable to find unit [minute]');
                        }
                    },
                    'incomparable unit': function () {
                        try {
                            unitd(3, unitd.distance.foot).as(unitd.time.minute);
                            fail('Exception expected');
                        }
                        catch (e) {
                            assert(e instanceof Error);
                            assert.match(e.message, 'Unit foot is not comparable to minute');
                        }
                    }
                }
            },
            'units': {
                'distance': {
                    '': function () {
                        assert(Object.create(unitd.distance.prototype) instanceof unitd.Unit);

                        assert(unitd.distance.meter.isComparable(unitd.distance.kilometer));
                        assert(unitd.distance.meter.isComparable(unitd.distance.millimeter));
                        assert(unitd.distance.kilometer.isComparable(unitd.distance.meter));
                        assert(unitd.distance.kilometer.isComparable(unitd.distance.millimeter));
                        assert(unitd.distance.millimeter.isComparable(unitd.distance.kilometer));
                        assert(unitd.distance.millimeter.isComparable(unitd.distance.meter));

                        refute(unitd.distance.meter.isComparable(unitd.amount.count));
                        refute(unitd.distance.kilometer.isComparable(unitd.amount.count));
                        refute(unitd.distance.millimeter.isComparable(unitd.amount.count));
                        refute(unitd.amount.count.isComparable(unitd.distance.meter));
                        refute(unitd.amount.count.isComparable(unitd.distance.kilometer));
                        refute(unitd.amount.count.isComparable(unitd.distance.millimeter));
                    },
                    'meters': function () {
                        var unit = unitd.distance.meter;

                        assert(unit instanceof unitd.Unit);
                        assert(unit instanceof unitd.Unit.distance);

                        assert.same(unit.name, 'meter');
                        assert.same(unit.abbr, 'm');
                        assert.same(unit.scale, 1);
                    },
                    'kilometers': function () {
                        var unit = unitd.Unit.distance.kilometer;

                        assert(unit instanceof unitd.Unit);
                        assert(unit instanceof unitd.Unit.distance);

                        assert.same(unit.name, 'kilometer');
                        assert.same(unit.abbr, 'km');
                        assert.same(unit.scale, 1000);
                    },
                    'millimeters': function () {
                        var unit = unitd.Unit.distance.millimeter;

                        assert(unit instanceof unitd.Unit);
                        assert(unit instanceof unitd.Unit.distance);

                        assert.same(unit.name, 'millimeter');
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
