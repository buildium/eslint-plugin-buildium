# disallow implicit angular annotations (buildium/angular-strict-di)

> To allow the minifiers to rename the function parameters and still be able to inject the right services, the function needs to be annotated with the $inject property. The $inject property is an array of service names to inject.

## Rule Details

This rule disallows functions or providers that do not have explicit annotations using the $inject array. It also looks for uses of the `@ngInject` comment used by [ng-annotate](https://github.com/olov/ng-annotate) and its derivatives. 

Examples of **incorrect** code for this rule:

```js
/*eslint buildium/angular-strict-di: "error"*/

angular.module('helloworld').service(function MyService($http, $q) {

});
```

Examples of **correct** code for this rule:

```js
/*eslint buildium/angular-strict-di: "error"*/

function MyService($http, $q) {

}
MyService.$inject = ['$http', '$q'];
angular.module('helloworld').service(MyService);
```

## Options

This rule accepts an object option:

```json
{
    "angular-strict-di": ["error", {
        "allowArray": true
    }]
}
```

You can use an object option to further configure this rule.
The default for each option is `false` unless otherwise specified.

* `inlineArray` allows [inline array annotation](https://docs.angularjs.org/guide/di#dependency-annotation) (e.g. `['$scope', 'greeter', function($scope, greeter) {}]`)


### inlineArray

Examples of **incorrect** code for this rule with the `{"inlineArray": true}` option:

```js
/*eslint buildium/angular-strict-di: ["error", {"inlineArray": false}]*/

someModule.controller('MyController', ['$scope', 'greeter', function($scope, greeter) {
  // ...
}]);
```

Examples of **correct** code for this rule with the `{"inlineArray": true}` option:

```js
/*eslint buildium/angular-strict-di: ["error", {"inlineArray": true}]*/

someModule.controller('MyController', ['$scope', 'greeter', function($scope, greeter) {
  // ...
}]);
```

## Related Rules

* [angular/di](https://github.com/EmmanuelDemey/eslint-plugin-angular/blob/master/docs/rules/di.md)