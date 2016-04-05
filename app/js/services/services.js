/*var controllers = angular.module('maris');
controllers.value('Server', 'http://46.101.165.30:3000/profiles')

controllers.factory('API', ['$http', 'Server', function ($http, Server) {
    var API = {};

    API.getProfiles = function () {
        return $http.get(Server)
    };

    API.getProfile = function (id) {
        return $http.get(Server + '/' + id);
    };

    API.insertProfile = function (report) {
        return $http.post(Server, report);
    };

    API.updateProfile = function (id, report) {
        return $http.put(Server + '/' + id, report)
    };

    API.deleteProfile = function (id) {
        return $http.delete(Server + '/' + id);
    };
    return API;
}])*/
var controllers = angular.module('maris');

controllers.factory('ModelData', function($http) { 

    var obj = {};

    obj.getData = function () {
        return $http.get('WorkflowTemplate.json');
    }

    return obj;    
});

/*REST API GEOSERVER*/
controllers.value('geoServer', 'http://130.89.221.193:85/geoserver/rest/workspaces')

controllers.factory('workspaces', ['$http', 'geoServer', function ($http, geoServer) {
    var workspaces = {};

   workspaces.getWorkspaces = function () {
        return $http.get(geoServer);
    };

    workspaces.getProfile = function (name) {
        return $http.get(geoServer + '/' + name);
    };
    return workspaces;
}]);

/*controllers.factory('AnimalTable', function ($http) {
    // controller code goes here
    // Get all todos
    var animalsTable = [];
    
    animalsTable.getData = function () {
        return $http.get('http://localhost:3000/api/v1/statictables');
    }
    return animalsTable;
});*/