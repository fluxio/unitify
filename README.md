unitd.js
=======

Units and conversions


Build Status
------------

<table>
  <tr><td>Master</td><td><a href="http://travis-ci.org/scothis/unitd" target="_blank"><img src="https://secure.travis-ci.org/scothis/unitd.png?branch=master" /></a></tr>
</table>


Usage
-----

TBD


Supported Environments
----------------------

Our goal is to work in every major JavaScript environment; Node.js and major browsers are actively tested and supported.

If your preferred environment is not supported, please let us know. Some features may not be available in all environments.

Tested environments:
- Node.js (0.6, 0.8. 0.10)
- Chrome (stable)
- Firefox (stable, ESR, should work in earlier versions)
- IE (6-10)
- Safari (5, 6, iOS 4-6, should work in earlier versions)
- Opera (11, 12, should work in earlier versions)

Specific browser test are provided by [Travis CI](https://travis-ci.org/scothis/unitd) and [Sauce Labs' Open Sauce Plan](https://saucelabs.com/opensource). You can see [specific browser test results](https://saucelabs.com/u/scothis-unitd), although odds are they do not reference this specific release/branch/commit.


Getting Started
---------------

rest.js can be installed via [npm](https://npmjs.org/), [Bower](http://twitter.github.com/bower/), or from source.

To install without source:

    $ npm install unitd

or

    $ bower install unitd

From source:

    $ npm install

unitd.js is designed to run in a browser environment, utilizing [AMD modules](https://github.com/amdjs/amdjs-api/wiki/AMD), or within [Node.js](http://nodejs.org/).  [curl.js](https://github.com/cujojs/curl) is highly recommended as an AMD loader, although any loader should work.

An ECMAScript 5 compatible environment is assumed.  Older browsers, ::cough:: IE, that do not support ES5 natively can be shimmed.  Any shim should work, although we've tested against cujo's [poly.js](https://github.com/cujojs/poly)


Documentation
-------------

TBD


Running the Tests
-----------------

The test suite can be run in two different modes: in node, or in a browser.  We use [npm](https://npmjs.org/) and [Buster.JS](http://busterjs.org/) as the test driver, buster is installed automatically with other dependencies.

Before running the test suite for the first time:

    $ npm install

To run the suite in node:

    $ npm test

To run the suite in a browser:

    $ npm start
    browse to http://localhost:8282/ in the browser(s) you wish to test.  It can take a few seconds to start.


Copyright
---------

Copyright 2013 the original author or authors

unitd.js is made available under the MIT license.  See LICENSE.txt for details.


Change Log
----------

No releases yet
