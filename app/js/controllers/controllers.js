var controllers = angular.module('maris');


controllers.controller('logInCtrl', ['$scope', '$log', '$http', '$mdDialog', '$mdMedia', function ($scope, $log, $http, $mdDialog, $mdMedia) {

    //Close the modal window
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    //Show the modal window
    $scope.showLogIn = function (ev) {
        $mdDialog.show({
            controller: WordController,
            templateUrl: 'views/login.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

    function WordController($scope, $http, $mdDialog) {

        $scope.message = "";
        //Login Variables
        $scope.loginInfo = {
            email: undefined,
            password: undefined
        };
        //functions
        $scope.logIn = function () {
            var data = {
                email: $scope.loginInfo.email,
                password: $scope.loginInfo.password
            };
            $http.post("models/login.php", data).success(function (response) {
                if (response != 0) {
                    $scope.message = "You have successfully logged in!";
                    setTimeout(function () {
                        $mdDialog.hide();
                    }, 500);
                    //Login Successfull.
                    //Close the login dialog
                    //Relocate to an authorised page
                    var x = document.getElementById("user");
                    x.innerHTML = response[0].name;
                    console.log(response);
                    localStorage.setItem("user", JSON.stringify({
                        user: response[0].name
                    }));
                } else {
                    //Notify user of wrong login details
                    $scope.message = "Username or password is not valid. Try again!";
                    console.log("Not Logged In");
                }


            }).error(function (error) {
                console.error(error);
            });

        };
        //Init

        //Registration Variables
        $scope.userInfo = {
            firstname: undefined,
            lastname: undefined,
            company: undefined,
            email: undefined,
            password: undefined,
            confirmPass: undefined
        };

        //function
        $scope.register = function () {

            var data = {
                firstname: $scope.userInfo.firstname,
                lastname: $scope.userInfo.lastname,
                company: $scope.userInfo.company,
                email: $scope.userInfo.email,
                password: $scope.userInfo.password,
                confirmPass: $scope.userInfo.confirmPass
            };
            if ($scope.userInfo.password == $scope.userInfo.confirmPass) {
                $http.post("models/register.php", data).success(function (response) {
                    if (response == 1) {
                        //Successfull Registration
                        $scope.message = "You have succesfully registered!"
                        var x = document.getElementById("user");
                        x.innerHTML = $scope.userInfo.firstname+" "+$scope.userInfo.lastname;
                        //Close the Registration Dialog
                        setTimeout(function () {
                            $mdDialog.hide();
                        }, 500);
                    } else {
                        //Unsuccessful registration
                        //Inform user to try again
                        $scope.message = "Something is wrong. Try again!";
                    }
                    console.log(response);

                }).error(function (error) {
                    console.error(error);
                });
            } else {
                $scope.message = "Password does not match the confirm password. Try again!";
            }
        };
    };



}]);


controllers.controller('testCtrl', ['$scope', '$log', '$http', 'ModelData', 'workspaces', function ($scope, $log, $http, ModelData, olData) {
    ModelData.getData().success(function (data) {

        /* Counting the number of subworkflows, number of operations of each subworkflow */
        $scope.subWFLarray = data.subworkflows;
        $scope.subWFLcount = $scope.subWFLarray.length;
        $scope.tab = 0;
        $scope.setTab = function (sbwf_id) {
            $scope.tab = sbwf_id;
        };
        $scope.isSet = function (sbwf_id) {
            return $scope.tab === sbwf_id;
        };
        /* Create initial content - outputs of final operations */
        $scope.createContent = function (sbwf_id) {

            /* create array for future work - it will be in separate function */
            var currConn = [];
            /* operCount - is a number of all operations in this subworkflow */
            $scope.oper = $scope.subWFLarray[sbwf_id].operations;

            // Clean the workflow area
            //$(".finalOutputs_outputs").empty();



            ///Make a tree
            $scope.unflatten = function (arr) {
                var tree = [],
                    mappedArr = {},
                    arrElem,
                    mappedElem;

                // First map the nodes of the array to an object -> create a hash table.
                for (var i = 0, len = arr.length; i < len; i++) {
                    arrElem = arr[i];
                    //console.log(arrElem);
                    mappedArr[arrElem.id] = arrElem;
                    mappedArr[arrElem.id]['children'] = [];
                }

                for (var id in mappedArr) {
                    if (mappedArr.hasOwnProperty(id)) {
                        mappedElem = mappedArr[id];
                        if (mappedElem.connections.length !== 0) {
                            var a = [];
                            for (var j = 0; j < mappedElem.connections.length; j++) {
                                a.push(mappedElem.connections[j].fromOperationId);
                            }
                            //console.log(a);
                            for (var k = 0; k < a.length; k++) {
                                mappedElem.children.push(arr[a[k]]);
                            }
                            if (mappedElem.connections.length < mappedElem.inputs.length) {

                                for (var m = 0; m < mappedElem.inputs.length; m++) {
                                    var isFound = false;
                                    var cnt = 0;
                                    for (var j = 0; j < mappedElem.connections.length; j++) {
                                        if (mappedElem.inputs[m].id !== mappedElem.connections[j].toParameterId) {
                                            cnt++;
                                        }
                                        if (cnt == mappedElem.connections.length) {
                                            mappedElem.children.push(mappedElem.inputs[m]);
                                            isFound = true;
                                            break;
                                        }
                                    }
                                    if (isFound) {
                                        break;
                                    }
                                }
                            }
                        } else {
                            var a = [];
                            for (var j = 0; j < mappedElem.inputs.length; j++) {
                                mappedElem.children.push(mappedElem.inputs[j]);
                            }
                        }
                        delete mappedElem["inputs"];
                        delete mappedElem["connections"];
                        if (mappedElem.final == true) {
                            tree.push(mappedElem);
                        }
                    }
                }
                return tree;
            }
            $scope.transformation = function (operations) {
                var opWf = [];
                for (var i = 0; i < operations.length; i++) {
                    opWf.push({
                        'id': operations[i].id,
                        'final': operations[i].metadata.final,
                        'inputs': operations[i].inputs,
                        'name': operations[i].outputs[0].name,
                        'connections': operations[i].connections
                    })
                }
                return opWf;
            }
            $scope.ttt = $scope.transformation($scope.oper);
            $scope.tree = $scope.unflatten($scope.ttt);
            console.log($scope.tree);
        };

        $scope.showOutput = function (tree) {
            $scope.selectedName = tree;
            console.log($scope.selectedName);

            for (var i = 0; i < $scope.oper.length; i++) {
                if ($scope.selectedName == $scope.oper[i].outputs[0].name) {
                    $scope.url = $scope.oper[i].outputs[0].url;
                } else {
                    for (var j = 0; j < $scope.oper[i].inputs.length; j++) {
                        if ($scope.selectedName == $scope.oper[i].inputs[j].name) {
                            $scope.url = $scope.oper[i].inputs[j].url;
                        }
                    }
                }
            }
            console.log($scope.url);

            angular.extend($scope, {
                output_map: [
                    {
                        name: $scope.selectedName,
                        source: {
                            type: 'ImageWMS',
                            url: 'http://130.89.221.193:85/geoserver/wms',
                            params: {
                                'LAYERS': 'test:' + $scope.selectedName
                            }
                        },
                        visible: true
                    }
                ]
            })
        };

        $scope.showInputs = function (selectedName) {
            $scope.inputs_maps = [];
            $scope.inputs_values = [];
            for (var i = 0; i < $scope.oper.length; i++) {
                if (selectedName == $scope.oper[i].outputs[0].name) {
                    for (var j = 0; j < $scope.oper[i].inputs.length; j++) {
                        if ($scope.oper[i].inputs[j].type == 'map') {
                            $scope.inputs_maps.push({
                                "name": $scope.oper[i].inputs[j].name,
                                "source": {
                                    "type": 'ImageWMS',
                                    "url": 'http://130.89.221.193:85/geoserver/wms',
                                    "params": {
                                        'LAYERS': 'test:' + $scope.oper[i].inputs[j].name
                                    }
                                },
                                "visible": true
                            });
                        } else if ($scope.oper[i].inputs[j].type == 'value') {
                            $scope.inputs_values.push({
                                "name": $scope.oper[i].inputs[j].name,
                                "value": $scope.oper[i].inputs[j].value,
                                "units": $scope.oper[i].inputs[j].units,
                                "min": $scope.oper[i].inputs[j].min,
                                "max": $scope.oper[i].inputs[j].max,
                                "typeInp": $scope.oper[i].inputs[j].type,
                                "change": $scope.oper[i].inputs[j].change
                            });
                        }
                    }
                }
            };
            $scope.activeUser = false;

            console.log($scope.inputs_maps);
            console.log($scope.inputs_values);
        };

        //$('')
    });



    /*Maps, Openlayers*/
    angular.extend($scope, {
        center: {
            lat: -1.18,
            lon: 35.51,
            zoom: 8
        },
        landmarks: [
            {
                name: 'areas',
                active: false,
                source: {
                    type: 'ImageWMS',
                    url: 'http://130.89.221.193:85/geoserver/wms',
                    params: {
                        'LAYERS': 'test:Protected-Areas_WGS'
                    }
                },
                visible: true
            },
            {
                name: 'roads',
                active: false,
                source: {
                    type: 'ImageWMS',
                    url: 'http://130.89.221.193:85/geoserver/wms',
                    params: {
                        'LAYERS': 'test:Roads_WGS'
                    }
                },
                visible: false
            },
            {
                name: 'cities',
                active: true,
                source: {
                    type: 'ImageWMS',
                    url: 'http://130.89.221.193:85/geoserver/wms',
                    params: {
                        'LAYERS': 'test:Towns_WGS'
                    }
                },
                visible: true
            }
        ],
        bounds: {
            active: true,
            source: {
                type: 'ImageWMS',
                url: 'http://130.89.221.193:85/geoserver/wms',
                params: {
                    'LAYERS': 'test:Boundaries_Mamase'
                }
            }
        },

        biomass: {
            source: {
                type: 'ImageWMS',
                url: 'http://130.89.221.193:85/geoserver/wms',
                params: {
                    'LAYERS': 'test:biomass'
                }
            }
        },
        slope: {
            source: {
                type: 'ImageWMS',
                url: 'http://130.89.221.193:85/geoserver/wms',
                params: {
                    'LAYERS': 'test:slope_mamase'
                }
            }
        },
        rainfall: {
            source: {
                type: 'ImageWMS',
                url: 'http://130.89.221.193:85/geoserver/wms',
                params: {
                    'LAYERS': 'test:rainfall'
                }
            }
        }
    });
}]);

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

controllers.controller('RESTgeo', ['$scope', '$http', 'workspaces', function ($scope, $http, workspaces) {
    /*workspaces.getWorkspaces().success(function (data) {
        console.log(data);
    });*/

}]);



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