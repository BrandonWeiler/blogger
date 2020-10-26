
var app = angular.module('bloggerApp', ['ngRoute', 'ui.router']);

//configuring routes
app.config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode({
    enabled:true,
    requireBase: false
 });
  $routeProvider
      .when('/', {
	      	templateUrl: 'pages/home.html',
		  	controller: 'homeCtrl',
		  	controllerAs: 'vm'
		  })

      .when('/bloglist', {
	        templateUrl: 'pages/bloglist.html',
		  	controller : 'listCtrl',
		  	controllerAs: 'vm'
		  })

      .when('/blogadd', {
	    	templateUrl: 'pages/blogadd.html',
		  	controller: 'addCtrl',
		  	controllerAs: 'vm'
		  })

        .when('/blogedit/:id', {
	        templateUrl: 'pages/blogedit.html',
		  	controller: 'editCtrl',
		  	controllerAs: 'vm'
		  })

		.when('/blogdelete/:id', {
			templateUrl: 'pages/blogdelete.html',
		 	controller: 'deleteCtrl',
		 	controllerAs: 'vm'
		  })

      	.otherwise({redirectTo: '/'});
    });

//*** Controllers ***
app.controller('homeCtrl', function homeCtrl() {
    	var vm = this;
    	vm.title = "Brandon A. Weiler\'s Blog Site";
    	vm.message = "Welcome to my blog! Have fun reading my random thoughts!";
});

app.controller('listCtrl',['$http', '$scope',  function listCtrl($http, $scope){
	var vm = this;
	vm.title = "Brandon A. Weiler\'s Blog Site";
	vm.message = "List of Blog Entries";
	

	getBlogList($http)
		.then(function (data){
			$scope.blogs = data.data;
			console.log(data);
			vm.message = "Found blogs";
		},
		function (e){
			vm.message = "Could not get blog list";
		});
}]);

app.controller('addCtrl',[ '$http', '$location', function addCtrl($http, $location) {
	var vm = this;
    	vm.blog = {};
    	vm.title = "Brandon A. Weiler\'s Blog Site";
		vm.message = "Add A Blog Entry";
	
         vm.onSubmit = function() {

	var data = vm.blog;

	data.blogTitle = userForm.blogTitle.value;
	data.blogText = userForm.blogText.value;

	addOneEntry($http, data)
		.then(function successCallBack(data) {
		     console.log(data);
		     $location.path('/bloglist');
		},
		function errorCallBack(e) {
		    console.log(e);
		});
        };
}]);

app.controller('editCtrl', [ '$http', '$routeParams', '$scope', '$location',  function editCtrl($http, $routeParams, $scope, $location) {
    var vm = this;
    vm.title = "Brandon A. Weiler\'s Blog Site";
    vm.message = "Edit Your Blog";
    vm.id = $routeParams.id;

    readOneEntry($http, vm.id)
    	.then(function(data) {
    		$scope.blog = data.data;
    },
    function(e) {
    	vm.message = "Could not find a blog entry with id: " + vm.id;
    });

    vm.onSubmit = function() {
    	var data = {};
    	data.blogTitle = userForm.blogTitle.value;
    	data.blogText = userForm.blogText.value;

    	updateOneEntry($http, data, vm.id)
    		.then(function(data) {
    		    vm.message = "Entry updated.";
    		    $location.path('/bloglist');
    		},
    		function(e) {
    			vm.message = "Could not update blog entry with id: " + vm.id;
    		});
    }
}]);

app.controller('deleteCtrl', [ '$http', '$routeParams', '$scope','$location', function deleteCtrl($http, $routeParams, $scope, $location) {
    var vm = this;
    vm.title = "Brandon A. Weiler\'s Blog Site";
    vm.message = "Delete Your Blog";
    vm.id = $routeParams.id;
    readOneEntry($http, vm.id)
    	.then(function(data) {
    		$scope.blog = data.data;
    		vm.message = "Are you sure you wish to delete this entry?"
	},
    	function(e) {
    	vm.message = "Could not get blog entry with id: " + vm.id;
    });

    vm.onSubmit = function() {

    	deleteOneEntry($http,vm.id)
    		.then(function(data) {
    		    vm.message = "Blog Deleted Successfully!";
    		    $location.path('/bloglist');
    		},
    		function(e) {
    			vm.message = "Could not update blog entry with id: " + vm.id;
    		});
    }

}]);


/* REST Functions */
function getBlogList($http) {
    return $http.get('/api/blogs');
}

function readOneEntry($http, blogid) {
    return $http.get('/api/blogs/' + blogid);
}

function updateOneEntry($http, data, blogid) {
    return $http.put('/api/blogs/' + blogid , data);
}

function addOneEntry($http, data) {
    return $http.post('/api/blogs', data);
}

function deleteOneEntry($http, blogid) {
    return $http.delete('/api/blogs/' + blogid);
}