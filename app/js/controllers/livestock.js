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