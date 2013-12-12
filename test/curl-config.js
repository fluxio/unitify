/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (global) {
    'use strict';

    global.curl = {
        packages: [
            { name: 'unitd', location: './', main: 'unitd' },
            { name: 'curl', location: 'node_modules/curl/src/curl', main: 'curl' },
            { name: 'poly', location: 'node_modules/poly', main: 'poly' }
        ],
        preloads: ['poly']
    };

}(this));
