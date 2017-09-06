'use strict';
var fs = require('fs');
var path = require('path');

fs.readdirSync('rules').filter(function (name) {
    return fs.lstatSync(path.join('rules', name)).isDirectory();
}).forEach(function(ruleName) {
    require(path.join(__dirname, 'rules', ruleName, ruleName + '.test.js'));
});