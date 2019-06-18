# eslint-plugin-buildium

## Installation

npm install eslint-plugin-buildium --save-dev

## Rules

There are four custom rules:

* func-names
    * Requires that all functions be named, unless they are passed as an argument to another function
* template-location
    * Requires that template includes (i.e. fs.readFileSync() calls) be located outside of module.exports
* imports-lodash
    * Requires that require('lodash') is not used (should use underscore or a specific lodash function)
* imports-jquery
    * Requires that jquery be used instead of jQuery (which causes jquery to be bundled incorrectly for us)
* no-focused-tests
    * Requires that no files may be checked in with fdescribe, ddescribe, fit or iit.
* [angular-strict-di](./rules/angular-strict-di/angular-strict-di.md)
    * Requires that AngularJS functions use explicit annotations with $inject array.
