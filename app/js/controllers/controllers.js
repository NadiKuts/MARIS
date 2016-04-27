var controllers = angular.module('maris');



/*View additional tables*/
controllers.controller('DBCtrl', ['$scope', '$http', function ($scope, $http) {
    // controller code goes here
    // Get data from table
    $scope.data = [];
    $http.get('http://130.89.221.193:3000/api/v1/statictables')
        .success(function (data) {
            $scope.tableRows = data;
            console.log($scope.tableRows);
        })
        .error(function (error) {
            console.log('Error: ' + error);
        });
}]);

/*controllers.controller('RESTgeo', ['$scope', '$http', 'workspaces', function ($scope, $http, workspaces) {
    workspaces.getWorkspaces().success(function (data) {
        console.log(data);
    });

}]);*/



/*expand*/
controllers.controller('expandCollapseCtrl', function ($scope) {
    $scope.active = true;
    $scope.active1 = true;
});

/* Sidenav */
controllers.controller('SidenavCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function () {
        return $mdSidenav('right').isOpen();
    };

    /* Supplies a function that will continue to operate until the time is up */
    function debounce(func, wait, context) {
        var timer;

        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function () {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    /**
       Build handler to open/close a SideNav; when animation finishes
       report completion in console
     */
    function buildDelayedToggler(navID) {
        return debounce(function () {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        }, 200);
    }

    function buildToggler(navID) {
        return function () {
            $mdSidenav(navID)
                .toggle()
                .then(function () {});
        }
    }
});

controllers.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
        $mdSidenav('right').close()
            .then(function () {});
    };
});