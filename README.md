# eslint-plugin-buildium

## Installation

npm install eslint-plugin-buildium --save-dev

## Rules

There are four custom rules:

* bd-func-names
    * Requires that all functions be named, unless they are passed as an argument to another function
* bd-template-location
    * Requires that template includes (i.e. fs.readFileSync() calls) be located outside of module.exports
* bd-imports-lodash
    * Requires that require('lodash') is not used (should use underscore or a specific lodash function)
* bd-imports-jquery
    * Requires that jquery be used instead of jQuery (which causes jquery to be bundled incorrectly for us)
    
