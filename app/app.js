'use strict';

// Declare app level module which depends on views, and components
/*angular.module('maris', ['ngRoute', 'ngMaterial', 'mdDataTable', 'angularBootstrapNavTree'])*/
angular.module('maris', ['ngRoute', 'ngMaterial', 'md.data.table', 'angularTreeview', 'openlayers-directive', 'ui.bootstrap', 'ngMessages'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: "views/workflow.html"
        })
        
        .when('/livestock', {
            templateUrl: "views/livestock.html"
        })
        /*
        .when('/priceinfo', {
            templateUrl: "views/priceinfo.html",
            controller: "dictionaryCtr"
        })
        
        .when('/about', {
            templateUrl: "views/about.html",
            controller: "dictionaryCtr"
        })
        */
}]);