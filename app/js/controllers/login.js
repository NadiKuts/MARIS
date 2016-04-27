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

