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
    
License
-------

The MIT License (MIT)

Copyright (c) 2015 buildium

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.