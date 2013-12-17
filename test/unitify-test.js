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

    define('unitify-test', function (require) {

        var unitify = require('unitify');

        buster.testCase('unitify', {
            'exists': function () {
                assert(unitify);
            },
            'operations': {
                'add': function () {
                    var add = unitify.operations.getOperations().add;
                    assert.same(add(3, 5), 8);
                    assert.same(add(3, -2), 1);
                },
                'subtract': function () {
                    var subtract = unitify.operations.getOperations().subtract;
                    assert.same(subtract(3, 5), -2);
                    assert.same(subtract(3, -2), 5);
                },
                'multiply': function () {
                    var multiply = unitify.operations.getOperations().multiply;
                    assert.same(multiply(3, 5), 15);
                    assert.same(multiply(3, -2), -6);
                },
                'divide': function () {
                    var divide = unitify.operations.getOperations().divide;
                    assert.same(divide(3, 5), 0.6);
                    assert.same(divide(3, -2), -1.5);
                }
            },
            'Measure': {
                'raw': function () {
                    assert.same(unitify(3).raw, 3);
                },
                'precision': function () {
                    assert.same(unitify(3, 2).precision, 2);

                    // precision is bounded between 1 and 21
                    assert.same(unitify(3).precision, 15);
                    assert.same(unitify(3, 100).precision, 15);
                    assert.same(unitify(3, -100).precision, 1);
                },
                'val': function () {
                    assert.same(unitify(987654321.01234,  1).val, 1000000000);
                    assert.same(unitify(987654321.01234,  2).val, 990000000);
                    assert.same(unitify(987654321.01234,  3).val, 988000000);
                    assert.same(unitify(987654321.01234,  4).val, 987700000);
                    assert.same(unitify(987654321.01234,  5).val, 987650000);
                    assert.same(unitify(987654321.01234,  6).val, 987654000);
                    assert.same(unitify(987654321.01234,  7).val, 987654300);
                    assert.same(unitify(987654321.01234,  8).val, 987654320);
                    assert.same(unitify(987654321.01234,  9).val, 987654321);
                    assert.same(unitify(987654321.01234, 10).val, 987654321.0);
                    assert.same(unitify(987654321.01234, 11).val, 987654321.01);
                    assert.same(unitify(987654321.01234, 12).val, 987654321.012);
                    assert.same(unitify(987654321.01234, 13).val, 987654321.0123);
                    assert.same(unitify(987654321.01234, 14).val, 987654321.01234);
                    assert.same(unitify(987654321.01234, 15).val, 987654321.01234);
                },
                'ctor': {
                    'Measure': function () {
                        var num = unitify(3);
                        assert.same(unitify(num).raw, 3);
                    },
                    'Number': function () {
                        var num = Number(3);
                        assert.same(unitify(num).raw, 3);
                    },
                    'number': function () {
                        var num = 3;
                        assert.same(unitify(num).raw, 3);
                    },
                    'string': function () {
                        var num = '3';
                        assert.same(unitify(num).raw, 3);
                    },
                    'String': function () {
                        var num = String('3');
                        assert.same(unitify(num).raw, 3);
                    },
                    'Object': function () {
                        var num = { toString: function () { return '3'; } };
                        assert.same(unitify(num).raw, 3);
                    },
                    'undefined': function () {
                        var num;
                        try {
                            num = unitify(num);
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
                            num = unitify(num);
                            fail('Error expected');
                        }
                        catch (e) {
                            assert(e instanceof Error);
                            assert.match(e.message, 'A number is required');
                        }
                    },
                    'string precision': function () {
                        assert.same(unitify('3').precision, 1);
                        assert.same(unitify('3.0').precision, 2);
                        assert.same(unitify('123.0').precision, 4);
                        assert.same(unitify('123.0', 1).precision, 1);
                        assert.same(unitify('123.0', 5).precision, 5);
                    },
                    'string unit': function () {
                        var meter = unitify.distance.meter;
                        assert.same(unitify('2').unit, unitify.magnitude);
                        assert.same(unitify('2 m').unit, meter);
                        assert.same(unitify('2', meter).unit, meter);
                        assert.same(unitify('2 ft', meter).unit, meter);
                        assert.same(unitify('2 mi m').unit, meter);
                    }
                },
                'toString': function () {
                    assert.same(unitify(4.567, unitify.distance.kilometer).toString(), '4.567 mi');
                    assert.same(unitify(4.567, unitify.distance.kilometer, 2).toString(), '4.6 mi');
                    assert.same(unitify(4.567).toString(), '4.567');
                    assert.same(unitify(4.567, 2).toString(), '4.6');
                },
                'operation': {
                    'add': function () {
                        var a = unitify(3),
                            b = unitify(5),
                            sum = a.add(b);
                        assert(sum instanceof unitify);
                        assert.same(sum.raw, 8);
                    },
                    'chain': function () {
                        var num = unitify(4).add(3).multiply(4).divide(2).subtract(1);
                        assert.same(num.val, 13);
                    },
                    'chained precision': function () {
                        var num = unitify(4).add(3).multiply(4).divide(2, 1).subtract(1);
                        assert.same(num.val, 10);
                    },
                    'with same units': function () {
                        var a = unitify(3, unitify.distance.meter),
                            b = unitify(5, unitify.distance.meter),
                            sum = a.add(b);
                        assert.same(sum.raw, 8);
                        assert.same(sum.unit, unitify.distance.meter);
                    },
                    'with comparable units': function () {
                        var a = unitify(3, unitify.distance.kilometer),
                            b = unitify(5000, unitify.distance.meter),
                            sum = a.add(b),
                            communitiveSum = b.add(a);
                        assert.same(sum.raw, 8);
                        assert.same(sum.unit, unitify.distance.kilometer);
                        assert.same(communitiveSum.raw, 8000);
                        assert.same(communitiveSum.unit, unitify.distance.meter);
                    },
                    'with incomparable units': function () {
                        var a = unitify(3, unitify.distance.meter),
                            b = unitify(5, unitify.amount.count);
                        try {
                            a.add(b);
                            fail('Exception expected');
                        }
                        catch (e) {
                            assert(e instanceof Error);
                            assert.match(e.message, 'Unit meter is not comparable to count');
                        }
                    },
                    'cannot add a magnitude': function () {
                        var a = unitify(3, unitify.distance.meter),
                            b = unitify(5);
                        try {
                            a.add(b);
                            fail('Exception expected');
                        }
                        catch (e) {
                            assert(e instanceof Error);
                            assert.match(e.message, 'Unit meter is not comparable to magnitude');
                        }
                        try {
                            b.add(a);
                            fail('Exception expected');
                        }
                        catch (e) {
                            assert(e instanceof Error);
                            assert.match(e.message, 'Unit magnitude is not comparable to meter');
                        }
                    },
                    'cannot add a magnitude, unless its to a magnitude': function () {
                        var a = unitify(3),
                            b = unitify(5),
                            sum = a.add(b);
                        assert.same(sum.raw, 8);
                        assert.same(sum.unit, unitify.magnitude);
                    },
                    'can multiply a magnitude': function () {
                        var a = unitify(3, unitify.distance.meter),
                            b = unitify(2),
                            product = a.multiply(b),
                            communitiveProduct = b.multiply(a),
                            magnitudeProduct = b.multiply(b);

                        assert.same(product.raw, 6);
                        assert.same(product.unit, unitify.distance.meter);

                        assert.same(communitiveProduct.raw, 6);
                        assert.same(communitiveProduct.unit, unitify.distance.meter);

                        assert.same(magnitudeProduct.raw, 4);
                        assert.same(magnitudeProduct.unit, unitify.magnitude);
                    }
                },
                'as': {
                    'comparable unit': function () {
                        assert.same(unitify(3, unitify.distance.foot).as('inch').val, 36);
                    },
                    'unknown unit': function () {
                        try {
                            unitify(3, unitify.distance.foot).as('minute');
                            fail('Exception expected');
                        }
                        catch (e) {
                            assert(e instanceof Error);
                            assert.match(e.message, 'Unable to find unit [minute]');
                        }
                    },
                    'incomparable unit': function () {
                        try {
                            unitify(3, unitify.distance.foot).as(unitify.time.minute);
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
                        assert(Object.create(unitify.distance.prototype) instanceof unitify.Unit);

                        assert(unitify.distance.meter.isComparable(unitify.distance.kilometer));
                        assert(unitify.distance.meter.isComparable(unitify.distance.millimeter));
                        assert(unitify.distance.kilometer.isComparable(unitify.distance.meter));
                        assert(unitify.distance.kilometer.isComparable(unitify.distance.millimeter));
                        assert(unitify.distance.millimeter.isComparable(unitify.distance.kilometer));
                        assert(unitify.distance.millimeter.isComparable(unitify.distance.meter));

                        refute(unitify.distance.meter.isComparable(unitify.amount.count));
                        refute(unitify.distance.kilometer.isComparable(unitify.amount.count));
                        refute(unitify.distance.millimeter.isComparable(unitify.amount.count));
                        refute(unitify.amount.count.isComparable(unitify.distance.meter));
                        refute(unitify.amount.count.isComparable(unitify.distance.kilometer));
                        refute(unitify.amount.count.isComparable(unitify.distance.millimeter));
                    },
                    'meters': function () {
                        var unit = unitify.distance.meter;

                        assert(unit instanceof unitify.Unit);
                        assert(unit instanceof unitify.Unit.distance);

                        assert.same(unit.name, 'meter');
                        assert.same(unit.abbr, 'm');
                        assert.same(unit.scale, 1);
                    },
                    'kilometers': function () {
                        var unit = unitify.Unit.distance.kilometer;

                        assert(unit instanceof unitify.Unit);
                        assert(unit instanceof unitify.Unit.distance);

                        assert.same(unit.name, 'kilometer');
                        assert.same(unit.abbr, 'km');
                        assert.same(unit.scale, 1000);
                    },
                    'millimeters': function () {
                        var unit = unitify.Unit.distance.millimeter;

                        assert(unit instanceof unitify.Unit);
                        assert(unit instanceof unitify.Unit.distance);

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
