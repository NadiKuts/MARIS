var controllers = angular.module('maris');


controllers.controller('logInCtrl', ['$scope', '$rootScope', '$log', '$http', '$mdDialog', '$mdMedia', function ($scope, $rootScope, $log, $http, $mdDialog, $mdMedia) {

    //Close the modal window
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    //Show the modal window
    $scope.showLogIn = function (ev) {
        $mdDialog.show({
            controller: LogController,
            templateUrl: 'views/login.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

    // $rootScope - is a global variable
    $rootScope.user = "";

    /* Indicator, whether user is logged in or not*/
    $rootScope.logged = false;

    /* LOG OUT FUNCTION SHOULD BE HERE !!!*/
    $scope.logOut = function () {

        //It should be left here as well
        //When user is logged out, the field will be empty again
        $rootScope.user = "";
        $rootScope.logged = false;
    };

    function LogController($scope, $rootScope, $http, $mdDialog) {
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
                    $rootScope.user = $scope.loginInfo.email;
                    setTimeout(function () {
                        $mdDialog.hide();
                    }, 1500);

                    //Login Successfull.
                    //Close the login dialog
                    //Relocate to an authorised page
                    console.log(response);
                    sessionStorage.setItem("user", JSON.stringify({
                        name: response[0].name,
                        email: response[0].email
                    }));
                    $rootScope.user = response[0].name;
                    console.log($rootScope.user);
                    $rootScope.logged = true;
                } else {
                    //Notify user of wrong login details
                    $scope.message = "Username or password is not valid. Try again!";
                    console.log("Not Logged In");
                    $rootScope.logged = false;
                }


            }).error(function (error) {
                console.error(error);
            });

        };


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
            if ($scope.userInfo.firstname != "" && $scope.userInfo.email != "" && $scope.userInfo.password != "") {
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
                            $scope.message = "You have succesfully registered!";
                            $rootScope.user = $scope.userInfo.firstname + " " + $scope.userInfo.lastname;
                            $rootScope.logged = true;
                            //Close the Registration Dialog
                            setTimeout(function () {
                                $mdDialog.hide();
                            }, 1500);
                        } else {
                            //Unsuccessful registration
                            //Inform user to try again
                            $scope.message = "Something is wrong. Try again!";
                            $rootScope.logged = false;
                        }
                        console.log(response);

                    }).error(function (error) {
                        console.error(error);
                    });
                } else {
                    $scope.message = "Password does not match the confirm password. Try again!";
                }
            }
        };
    };

}]);