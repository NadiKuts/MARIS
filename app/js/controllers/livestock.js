var controllers = angular.module('maris');

controllers.controller('livestockCtrl', ['$scope', function ($scope) {
    /*Maps, Openlayers*/
    angular.extend($scope, {
        center: {
            lat: -1.18,
            lon: 35.51,
            zoom: 8
        },
        markets: [
            {
                name: 'market0',
                active: false,
                source: {
                    type: 'ImageWMS',
                    url: 'http://130.89.221.193:85/geoserver/wms',
                    params: {
                        'LAYERS': 'test:market36s'
                    }
                },
                visible: true
            },
            {
                name: 'market1',
                active: false,
                source: {
                    type: 'ImageWMS',
                    url: 'http://130.89.221.193:85/geoserver/wms',
                    params: {
                        'LAYERS': 'test:market37s'
                    }
                },
                visible: true
            }
        ],
    });

    
}]);



controllers.controller('marketinfoCtrl',['$scope', '$http', function($scope, $http){
    //var data = { "email": ""};
    $scope.data = [];
    $http.post("models/marketinfo.php").success(function (data) {
        $scope.tableRows = data.cattle;
        $scope.sheepRows = data.sheep;
        $scope.goatRows = data.goats;
    });
    $scope.onTabSelect = function(tabName) {
       
        //$scope.selectedTabName = tabName;
        //console.log("Changed tab to " + tabName);
    }
}]);