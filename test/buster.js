/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var config = exports;

config['unitd:node'] = {
    environment: 'node',
    rootPath: '../',
    tests: [
        // 'test/**/*-test-node.js',
        'test/**/*-test.js'
    ]
};

config['unitd:browser'] = {
    environment: 'browser',
    autoRun: false,
    rootPath: '../',
    resources: [
        //'**', ** is busted in buster
        '*.js',
        'node_modules/curl/**',
        'node_modules/poly/**'
    ],
    libs: [
        'test/curl-config.js',
        'node_modules/curl/src/curl.js'
    ],
    sources: [
        // loaded as resources
    ],
    tests: [
        // 'test/**/*-test-browser.js',
        'test/**/*-test.js',
        'test/run.js'
    ]
};
