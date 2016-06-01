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
    $rootScope.myValue = false;
    $rootScope.admin = false;
    $scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Would you like to Log Out?')
              .textContent('You will not be able to run the Model If you log out.')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Yes! Log Out')
              .cancel('No! Stay Logged On');
        $mdDialog.show(confirm).then(function() {
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("email");
            sessionStorage.removeItem("id");
            $rootScope.user = "";
            $rootScope.logged = false;
            $rootScope.myValue = false;
            $rootScope.admin = false;

            window.location="#/";
        }, function() {
          
        });
    };

    $scope.$on('$routeChangeSuccess', function () {
        var data = sessionStorage.getItem("username");
        var id = sessionStorage.getItem("id");
        if(data == null || data == "" || sessionStorage.length == 0){
            $rootScope.logged = false;
            $rootScope.user = "";
            
            $rootScope.admin = false;
            $rootScope.myValue = false;
            window.location="#/";
        
        }else{
            $rootScope.logged = true;
            if(id == 1){
                $rootScope.admin = false;
                $rootScope.myValue = true; 
            }else{
                $rootScope.admin = true;
                $rootScope.myValue = false; 
            }
             
            $rootScope.user = data;
                     

            
        }
    });

    function LogController($scope, $rootScope, $http, $mdDialog) {
		
        $scope.message = "";
        //Login Variables
        $scope.loginInfo = {
            email: "",
            password: ""
        };
        //functions
        $scope.logIn = function () {
			if ($scope.loginInfo.email != "" && $scope.loginInfo.password != "") {
				var data = {
					email: $scope.loginInfo.email,
					password: $scope.loginInfo.password
				};
				$http.post("models/login.php", data).success(function (response) {
                    console.log(response);
                    if (response != 0) {
                        $scope.message = "You have successfully logged in!";
                        $rootScope.user = $scope.loginInfo.email;
                        setTimeout(function () {
                            $mdDialog.hide();
                        }, 500);
                        console.log(response);
                        sessionStorage.setItem("username", response[0].name);
                        sessionStorage.setItem("email", response[0].email);
                        sessionStorage.setItem("id", response[0].role);
                        $rootScope.user = sessionStorage.getItem("username");
                        if(response[0].role == 1){
                            $rootScope.admin = false;
                            $rootScope.myValue = true;
                        }else{
                            $rootScope.admin = true;
                            $rootScope.myValue = false;
                        }
                        $rootScope.logged = true;
                        
                    } else {
                        //Notify user of wrong login details
                        $scope.message = "Email or password is not valid. Try again!";
                        console.log("Not Logged In");
                        $rootScope.logged = false;
                    }
				}).error(function (error) {
					console.error(error);
				});
			}else{
				$scope.message = "Email and password Required!";
			}
        };


        //Registration Variables
        $scope.userInfo = {
            firstname: "",
            lastname: "",
            company: "",
            email: "",
            password: "",
            confirmPass: ""
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
                            sessionStorage.setItem("username", $scope.userInfo.firstname+' '+$scope.userInfo.lastname);
                            sessionStorage.setItem("email", $scope.userInfo.email);
                            sessionStorage.setItem("id", 1);
                            $rootScope.user = sessionStorage.getItem("username");
                            //$rootScope.user = $scope.userInfo.firstname + " " + $scope.userInfo.lastname;
                            $rootScope.logged = true;
                            //Close the Registration Dialog
                            setTimeout(function () {
                                $mdDialog.hide();
                            }, 500);
                        } else if (response == 0) {
                            //Unsuccessful registration
                            //Inform user to try again
                            $scope.message = "Something is wrong. Try again!";
                            $rootScope.logged = false;
                        }else {
                            $scope.message = "User with that Email Address Already Exist!";
                            $rootScope.logged = false;
                        }

                    }).error(function (error) {
                        console.error(error);
                    });
                } else {
                    $scope.message = "Password does not match the confirm password. Try again!";
                }
            }
        };

        //Forgot Password
        $scope.forgotInfo = {email: ""};
        $scope.forgotPassWord = function () {
			if($scope.forgotInfo.email != ""){
				var data = {email: $scope.forgotInfo.email};
                $scope.message = "Wait...Resetting Your Password!";
				$http.post("models/forgot.php", data).success(function (response) {
					if(response == 0){
						$scope.message = "Error! There was a problem in resetting your password!";
					}else if(response==-1){
						$scope.message = "Error! You Entered a wrong Email Address!";
					}
                    else{
                        $scope.message = "New Password Sent to Your Email Address!";
                        //Close the Dialog
                        setTimeout(function () {
                            $mdDialog.hide();
                        }, 2000);
                        var data = {
                            email: $scope.forgotInfo.email,
                            subject: "Password Reset",
                            message: "Dear user,<br><br>If this e-mail does not apply to you please ignore it. It appears that you have requested a password reset at our website www.maris.com.<br><br>Your new password is: <b>"+response+"</b><br>We recommend that you change it to your preferred password once you are logged in.<br><br>Thank You.<br>Technical Team-Mara Rangeland Information System (MARIS)"
                        };
                        $http.post("models/mail.php", data).success(function (response) {
                                console.log(response);
                        }).error(function (error) {
                            console.error(error);
                        });;
                    }
				}).error(function (error) {
					console.error(error);
				});
			}else{
				$scope.message = "Fill in your Email Address!";
			}
			
        };
		
    };

}]);

