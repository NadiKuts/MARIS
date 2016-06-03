var controllers = angular.module('maris');

controllers.controller('dashboardCtrl', ['$scope', '$http', '$mdDialog',
    function ($scope, $http, $mdDialog) {
        var address = sessionStorage.getItem("email");
        var username = sessionStorage.getItem("username");
        $scope.showChangePass = false;
        $scope.showForm = false;
        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.run =function(){
            $http.post("models/workflow.php").success(function (response) {
                //console.log(response);
                
            }).error(function (error) {
                console.error(error);
            });
        };

            
        function dashboardController($scope, $http, $mdDialog, test) {
            if(test.type == "changepassword"){
                
                $scope.email = address;
                $scope.updatePassword = function(){
                    $scope.userInfo = {
                        password: "",
                        confirmPass: "",
                        email: ""
                    };
                    var address = sessionStorage.getItem("email");
                    var data = {
                        password: this.userInfo.password,
                        confirmPass: this.userInfo.confirmPass,
                        email: address
                    }; 
                    if($scope.userInfo.password == $scope.userInfo.confirmPass){
                        $http.post("models/changepassword.php", data).success(function (response) {
                            console.log(response);
                        if (response > 0) {
                            $scope.message = "You Successfully changed your password!";
                            $scope.logged = true;
                            setTimeout(function () {
                                $mdDialog.hide();
                            }, 1000);                                
                        }else{
                                //Notify user of wrong login details
                            $scope.message = "Password was not changed. Try again!";
                            setTimeout(function () {
                                $scope.message = "";
                            }, 500);                                
                        }
                        }).error(function (error) {
                                console.error(error);
                        });
                    }else{
                        $scope.message = "Password Do Not Match!";
                    }            
                    
                }
            }
        };
        $scope.sampleAction = function(name, ev) {
              if(name == "ChangePassword"){
                        $scope.showChangePass = true;
                        $scope.showForm = false;
                        $mdDialog.show({
                        controller: dashboardController,
                        templateUrl: 'views/changepassword.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        resolve: {
                              test: function () {
                                var data = {
                                  type: 'changepassword', id: -1
                                };
                                return data;
                              }  
                        }
                    });
                    

              }
              else if(name == "AddScenario"){
                $scope.showChangePass = false;
                $scope.showForm = true;

              }else if(name == "Scenarios"){
                $scope.showChangePass = false;
                $scope.showForm = false;
              }

              else{
                $scope.showChangePass = false;
                $scope.showForm = false;
              }
        };
        
        

    }
]);