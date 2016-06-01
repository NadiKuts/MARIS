
var controllers = angular.module('maris');
controllers.filter('keyboardShortcut', function($window) {
    return function(str) {
      if (!str) return;
      var keys = str.split('-');
      var isOSX = /Mac OS X/.test($window.navigator.userAgent);
      var seperator = (!isOSX || keys.length > 2) ? '+' : '';
      var abbreviations = {
        M: isOSX ? '⌘' : 'Ctrl',
        A: isOSX ? 'Option' : 'Alt',
        S: 'Shift'
      };
      return keys.map(function(key, index) {
        var last = index == keys.length - 1;
        return last ? key : abbreviations[key];
      }).join(seperator);
    };
  });

controllers.controller('AdminCtrl', ['$scope','$http','$mdDialog', '$log', function ($scope,$http, $mdDialog,$log) {
        var s = $scope;
        $scope.livestock = false; 
        $scope.sheepValue = false;
        $scope.goatValue = false;
        $scope.showAddRole = false;
        $scope.showRoles = false;
        $scope.showActiveUser = false;
        $scope.sampleAction = function(name, ev) {
          if(name == "Cattle"){
              $scope.livestock = true;
              $scope.sheepValue = false;
              $scope.goatValue = false;
              $scope.showAddRole = false;
              $scope.showRoles = false;
              $scope.showActiveUser = false;
          }
          else if(name == "Sheep"){
            $scope.livestock = false;
            $scope.goatValue = false;
            $scope.showAddRole = false;
            $scope.showRoles = false;
            $scope.sheepValue = true; 
            $scope.showActiveUser = false;
          }
          else if(name == "Goats"){
            $scope.goatValue = true;
            $scope.livestock = false;
            $scope.sheepValue = false;
            $scope.showAddRole = false;
            $scope.showActiveUser = false;
            $scope.showRoles = false;
          }else if(name == "AddRole"){
            $scope.goatValue = false;
            $scope.livestock = false;
            $scope.sheepValue = false;
            $scope.showAddRole = true;
            $scope.showRoles = false;  
            $scope.showActiveUser = false;   
            $mdDialog.show({
                controller: LogController,
                templateUrl: 'views/role.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                resolve: {
                      test: function () {
                        var data = {
                          type: 'add', id: -1
                        };
                        return data;
                      }  
                }
            });
           

          }else if(name == "roles"){
            $scope.goatValue = false;
            $scope.livestock = false;
            $scope.sheepValue = false;
            $scope.showAddRole = true;
            $scope.showRoles = true;
            $scope.showActiveUser = false;
            var data = {
              type: "view"
            };
            $http.post("models/role.php", data).success(function (response) {
                if(response == 0){
                 
                }else{
                   $scope.roleRows = response;
                 }
            });
            $scope.sizes = "Edit,Delete";        
            $scope.selectFunct = function(response){
              if(this.selectedSize == "edit"){               
                    $mdDialog.show({
                    controller: LogController,
                    templateUrl: 'views/role.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    resolve: {
                      test: function () {
                        var data = {
                          type: 'edit', id: response
                        };
                        return data;
                      }                
                    }
                });

                  
              }else if(this.selectedSize == "delete"){
                  
                  this.showAddRole = false;
                  var data = {
                      type: "delete",
                      id: response
                    };
                    $http.post("models/role.php", data).success(function (response) {
                        if (response == 1) {
                            console.log("Deleted");                      
                        }else{
                            console.log("Failed");
                        }
                    });
              }else{
                  this.showAddRole = false;
              }
            }
            
          }else if(name == "Active"){
            $scope.goatValue = false;
            $scope.livestock = false;
            $scope.sheepValue = false;
            $scope.showAddRole = false;
            $scope.showActiveUser = true;
            $scope.showRoles = false;
            var data = {
              type: "view"
            };
            $http.post("models/users.php", data).success(function (response) {
                if(response == 0){
                 
                }else{
                   $scope.activeRows = response;
                 }
            });
            $scope.selectUser = function(response){
              /*if(this.selectedSize == "edit"){               
                    $mdDialog.show({
                    controller: LogController,
                    templateUrl: 'views/users.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    resolve: {
                      test: function () {
                        var data = {
                          type: 'edit', id: response
                        };
                        return data;
                      }                
                    }
                });

                  
              }else */
              if(this.selectedSize == "delete"){
                  
                  this.showAddRole = false;
                  var data = {
                      type: "delete",
                      id: response
                    };
                    $http.post("models/users.php", data).success(function (response) {
                        if (response == 1) {
                            console.log("Deleted");                  
                        }else{
                            console.log("Failed");
                        }
                    });
              }else{
                  //this.showAddRole = false;
              }
            }
          }
          else {
            $scope.livestock = false;
            $scope.sheepValue = false;
            $scope.goatValue = false;
            $scope.showAddRole = false;
            $scope.showRoles = false;
            $scope.showActiveUser = false;
          }
          
        };

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
           $mdDialog.cancel();
        };
        
        $scope.data = [];
        $http.post("models/marketinfo.php").success(function (data) {
            $scope.tableRows = data.cattle;
            $scope.sheepRows = data.sheep;
            $scope.goatRows = data.goats;
        });
        function LogController($scope, $http, $mdDialog, test) {

            if(test.type == "add"){
                $scope.title = "Add New Role";
                $scope.showAddForm = true;
                $scope.addNewRole = function(){
                $scope.roleInfo = {
                  type: "",
                  name: "",
                  description: ""
                };
                var data = {
                  type: "add",
                  name: this.roleInfo.name,
                  description: this.roleInfo.description
                };
                $http.post("models/role.php", data).success(function (response) {

                    if (response == 1) {
                        $scope.message = "New Role Added!";
                        setTimeout(function () {
                            $mdDialog.hide();
                          }, 500);
                         }else{
                            $scope.message = "Failed to add Role!";
                         }
                      });
                }
            }else if(test.type == "edit"){
                $scope.title = "Edit Role: "+test.id;
                $scope.showEditForm = true;
                var data = {
                  type: "get",
                  id: test.id               
                };
                $http.post("models/role.php", data).success(function (response) {
                    $scope.roleInfo = {                     
                      name: "",
                      description: ""
                    };
                    $scope.roleInfo.name = response[0].name;
                    $scope.roleInfo.description = response[0].description;

                });
                $scope.editRole = function(){
                    /*$scope.roleInfo = {                       
                        name: "",
                        description: ""
                    };*/
                    var data = {
                      type: "edit",
                      id: test.id,
                      name: $scope.roleInfo.name,
                      description: $scope.roleInfo.description
                    };
                    $http.post("models/role.php", data).success(function (response) {
                        if (response == 1) {
                            $scope.message = "Update Successful!";
                            
                            setTimeout(function () {
                                $mdDialog.hide();
                              }, 500);
                             }else{
                                $scope.message = "Failed to Update Role!";
                             }
                    });
                }
            }
            else{

            }
            
            //console.log(id);
            
        }    
        

        


    }]);