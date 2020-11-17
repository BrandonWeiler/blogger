
var app = angular.module('bloggerApp', ['ngRoute', 'ui.router']);

//*** Authentication Service and Methods **
app.service('authentication', authentication);
    authentication.$inject = ['$window', '$http'];
    function authentication ($window, $http) {

        var saveToken = function (token) {
            $window.localStorage['blog-token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['blog-token'];
        };

        var register = function(user) {
            console.log('Registering user ' + user.email + ' ' + user.password);
            return $http.post('/api/register', user).then(function(data){
                saveToken(data.data.token);
          });
        };

        var login = function(user) {
           console.log('Attempting to login user ' + user.email + ' ' + user.password);
            return $http.post('/api/login', user).then(function(data) {
            	 saveToken(data.data.token);
		    });
        };

        var logout = function() {
            $window.localStorage.removeItem('blog-token');
        };

        var isLoggedIn = function() {
          var token = getToken();

          if(token){
           var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
          } else {
            return false;
          }
        };

        var currentUser = function() {
          if(isLoggedIn()){
            var token = getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return {
              email : payload.email,
              name : payload.name
            };
          }
        };

        return {
          saveToken : saveToken,
          getToken : getToken,
          register : register,
          login : login,
          logout : logout,
          isLoggedIn : isLoggedIn,
          currentUser : currentUser
        };
}

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

		.when('/register', {
			templateUrl: '/common/auth/register.html',
			controller: 'registerCtrl',
			controllerAs: 'vm'
		})
	
		.when('/login', {
			templateUrl: '/common/auth/login.html',
			controller: 'loginCtrl',
			controllerAs: 'vm'
		})

      	.otherwise({redirectTo: '/'});
    });

//*** Controllers ***
app.controller('homeCtrl', function homeCtrl() {
    	var vm = this;
    	vm.title = "Brandon A. Weiler\'s Blog Site";
    	vm.message = "Welcome to the greatest blogging site this side of Sagittarius A*";
});

app.controller('listCtrl',['$http', '$scope', 'authentication',  function listCtrl($http, $scope, authentication){
	var vm = this;
	vm.title = "List of All Blog Entries";
	
	
	vm.isLoggedIn = function() {
		return authentication.isLoggedIn();
	}

  vm.correctUser = function(){
    return authentication.currentUser().name;
  }
	getBlogList($http)
		.then(function (data){
			$scope.blogs = data.data;
			console.log(data);
		},
		function (e){
			vm.message = "Could not get blog list";
		});
}]);

app.controller('addCtrl',[ '$http', '$location', 'authentication', function addCtrl($http, $location, authentication) {
	    var vm = this;
    	vm.blog = {};
    	vm.title = "Add A New Blog Entry";
		  
	
      vm.onSubmit = function() {

	      var data = vm.blog;

	      data.blogTitle = userForm.blogTitle.value;
        data.blogText = userForm.blogText.value;
        data.email = authentication.currentUser().email;
        data.userName = authentication.currentUser().name;

	      addOneEntry($http, data, authentication)
		      .then(function successCallBack(data) {
		          console.log(data);
		          $location.path('/bloglist');
		      },
		      function errorCallBack(e) {
		        console.log(e);
		      });
      };
}]);

app.controller('editCtrl', [ '$http', '$routeParams', '$scope', '$location', 'authentication',  function editCtrl($http, $routeParams, $scope, $location, authentication) {
    var vm = this;
    vm.title = "Edit Your Blog Entry";
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

    	updateOneEntry($http, data, vm.id, authentication)
    		.then(function(data) {
    		    vm.message = "Entry updated.";
    		    $location.path('/bloglist');
    		},
    		function(e) {
    			vm.message = "Could not update blog entry with id: " + vm.id;
    		});
    }
}]);

app.controller('deleteCtrl', [ '$http', '$routeParams', '$scope','$location', 'authentication', function deleteCtrl($http, $routeParams, $scope, $location, authentication) {
    var vm = this;
    vm.title = "Delete Your Blog Entry";
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

    	deleteOneEntry($http,vm.id, authentication)
    		.then(function(data) {
    		    vm.message = "Blog Deleted Successfully!";
    		    $location.path('/bloglist');
    		},
    		function(e) {
    			vm.message = "Could not update blog entry with id: " + vm.id;
    		});
    }

}]);
app.controller('loginCtrl', [ '$http', '$location', 'authentication', function loginCtrl($htttp, $location, authentication) {
    var vm = this;

    vm.title = 'Sign in to Blog';

    vm.credentials = {
      email : "",
      password : ""
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.email || !vm.credentials.password) {
           vm.formError = "All fields required, please try again";
        return false;
      } 
	  else {
           vm.doLogin();
      }
    };

     vm.doLogin = function() {
      vm.formError = "";
      authentication
        .login(vm.credentials)
        .then(function(){
          $location.search('page', null); 
          $location.path(vm.returnPage);
	},function(e){ vm.formError = e.data.message;});
        };
 }]);

app.controller('registerCtrl', [ '$http', '$location', 'authentication', function registerCtrl($htttp, $location, authentication) {
    var vm = this;

    vm.title = 'Create a new Blog account'

    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        return false;
      } else {
        vm.doRegister();
      }
    };

    vm.doRegister = function() {
      vm.formError = "";
      authentication
        .register(vm.credentials)
        .then(function(){
          $location.search('page', null);
          $location.path('/');
	 },function(e){vm.formError = "Email Already Registered"});
    };
}]);

app.directive('navigation', function() {
    return {
      restrict: 'EA',
      templateUrl: '/common/nav/navigation.html',
      controller: 'NavigationController',
      controllerAs: 'vm'
    };
});

app.controller('NavigationController', ['$state', '$location', 'authentication', function NavigationController($state, $location, authentication) {
    var vm = this;
    vm.currentPath = $location.path();
    vm.currentUser = function()  {
        return authentication.currentUser();
    }
    vm.isLoggedIn = function() {
        return authentication.isLoggedIn();
    }
    vm.logout = function() {
      authentication.logout();
      $location.path('/');
    };
}]);


/* REST Functions */
function getBlogList($http) {
    return $http.get('/api/blog');
}

function readOneEntry($http, blogid) {
    return $http.get('/api/blog/' + blogid);
}

function updateOneEntry($http, data, blogid, authentication) {
    return $http.put('/api/blog/' + blogid , data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }});
}

function addOneEntry($http, data, authentication) {
    return $http.post('/api/blog', data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }});
}

function deleteOneEntry($http, blogid, authentication) {
    return $http.delete('/api/blog/' + blogid, { headers: { Authorization: 'Bearer '+ authentication.getToken() }});
}