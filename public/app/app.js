var projectsRepo = angular.module("projectsRepo", ['ngRoute']);


projectsRepo.controller("projectsList", function($scope, $http){

    $scope.details = {
        brandName : 'ProjectsRepo',
        addNewProject : 'Add'
    }

    $scope.projects = [];
    $scope.toggleShowUpdate = false;
    $scope.toggleShowAdd = false;
    $scope.showTemplate = true;

    // Load all projects from DB 
    $scope.loadProjects = function(){
         $http.get('/api/getProjects')
         .then(function(data){
            $scope.projects = data.data;
         },function(error){
            console.log("something went wrong buddyyy !!!", error);
        });
    }

    // Add new project to the DB
    $scope.addProject = function(project){
        $scope.toggleShowAdd = false;
        $scope.showTemplate = true;
        $http.post('/api/getProjects', project)
             .then(function(project){
                $scope.loadProjects();
             },function(error){
                console.log("something went wrong buddyyy !!!", error);
            });
    }

    $scope.addNewProject = function(){
        $scope.toggleShowAdd = true;
        $scope.showTemplate = false;
    }
    $scope.cancel = function(){
        $scope.toggleShowAdd = false;
        $scope.toggleShowUpdate = false;
        $scope.showTemplate = true;
    }

    // Edit existing project
    $scope.editProject = function(project){
        $scope.toggleShowUpdate = true;
        $scope.showTemplate = false;
       $scope.projectToEdit = angular.copy(project);
    }

    // Update the project in the collection by using ID
    $scope.updateProject = function(projectToEdit){
        $scope.toggleShowUpdate = false;
        $scope.showTemplate = true;
        var id = projectToEdit._id;
        $http.put('/api/getProjects/' + id, projectToEdit)
        .then(function(projectToEdit){
            $scope.loadProjects();
        },function(error){
            console.log("something went wrong buddyyy !!!", error);
        });
    }

      // Delete the project in the collection by using ID
     $scope.deleteProject = function(project){
         var id = project._id;
        $http.delete('/api/getProjects/' + id, project)
            .then(function(project){
                $scope.loadProjects();
            },function(error){
                console.log("something went wrong buddyyy !!!", error);
            });
    }

// Load Technologies
    $scope.loadTechnologies = function(project){
        var currentTechnology = angular.element(event.target).text();        
        console.log("you are searching for technologies", currentTechnology);
        $http.get('/api/getTechnologies')
        .then(function(data){
            console.log('your technologies', data);
        },function(error){
           console.log("something went wrong in getTechnologies buddyyy !!!", error);
       });
    }
    
});

// custom directive
projectsRepo.directive('addNewproject', function(){
    return{
          templateUrl:'../partials/addNewProject.html'
    }
});


projectsRepo.directive('updateProject', function(){
    return{
          templateUrl:'../partials/updateProject.html'
    };
});

projectsRepo.directive('headerTemplate', function(){
    return{
          templateUrl:'../partials/header.html'
    };
});


projectsRepo.directive('projectTemplate', function(){
    return{
          templateUrl:'../partials/projectTemplate.html'
    };
});

projectsRepo.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl : '../partials/app.html',
            controller : 'projectsList'
        })
        .otherwise({
            redirectTo: "/"
        });
});


// custom filter
projectsRepo.filter('searchData', function () {
    return function (items) {
      var filtered = [];
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (/a/i.test(item.name.substring(0, 1))) {
          filtered.push(item);
        }
      }
      return filtered;
    };
  });

