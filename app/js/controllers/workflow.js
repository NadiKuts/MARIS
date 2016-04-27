var controllers = angular.module('maris');

controllers.controller('workflowCtrl', ['$scope', '$log', '$http', 'ModelData', 'workspaces', function ($scope, $log, $http, ModelData, olData) {
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
        ]
    });
}]);


/*expand*/
controllers.controller('expandCollapseCtrl', function ($scope) {
    $scope.active = true;
    $scope.active1 = true;
}); 