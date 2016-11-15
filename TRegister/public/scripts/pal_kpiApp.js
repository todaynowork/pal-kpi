angular.module('palKpiAppNgView', ['ngRoute'])
  .service('DBService', function($http) {
	  var self = this;
	  this.searchByCourseId = function (id) {
		  return $http.get('/courseFind/'+id);
	  };
	  this.fetch = function (id) {
		  return $http.get('/data/'+id);
	  };
	  this.fetchAll = function () {
		  return $http.get('/data');
	  };
	  
	  this.add = function (data) {
	      return $http.post('/data', data);
	  };
	  this.update = function (id,data) {
	  };
	  this.deletR = function (id) {
		  return $http.delete('/data/'+id);
	  };
	})
  .controller('CourseController', function ($log,$scope, $http,$routeParams,DBService) {
	    var course = this;
	  	course.coursePool = {
	  			javadl:{id:"javadl",title:"Java", location: "DL", text:'java fundamental', enroll:false},
	  			javacd:{id:"javacd",title:"Java", location: "CD", text:'java fundamental', enroll:false},
	  			javawh:{id:"javawh",title:"Java", location: "WH", text:'java fundamental', enroll:false}
	  	};

	  	var courseId = $routeParams.courseId;
	  	course.info = course.coursePool[courseId];
	  	
	    $scope.hasButtonPress = false;
	    var id = $scope.userId + "-" + courseId;
	    DBService.fetch(id)
	    .success(function(data){
	    	$log.debug(data);
	    	if(data._id!=null){
	    		course.enrolledCourse = data;
	    	}else{
	    		course.enrolledCourse = course.info;
	    	}
	    	$log.debug("course.enrolledCourse");
	    	$log.debug(course.enrolledCourse);
	    });
	    
	    DBService.searchByCourseId(courseId)
	    .success(function(data){
	    	$log.debug(data);
	    	if(data.total_rows> 0 ){
	    		course.courseList = data.rows;
		    	$log.debug(course.courseList);
	    	}
	    });
	    
//	    $log.debug($scope.courseId);
	    course.pay = function(){
	    	console.log(course.coursePool);
	    	for(courseId in course.coursePool) {
	    		var record = course.coursePool[courseId]
	    		$log(course.coursePool[courseId]);
	    		var id = $scope.userId + "-" + courseId;
	    		record._id = id;
	    		
	    		DBService.add(record).success(function(data) {
	  	    	  $log.debug(data);

	  	      });
	    	}
	    	$scope.hasButtonPress = false;
	    };
	    course.enroll = function() {
	      var newItem =	course.enrolledCourse;
	      newItem._id = id;
	      newItem.enroll = true;
	      newItem.userId = $scope.userId;
	      newItem.courseId = courseId;
	      $scope.hasButtonPress = true;
	      DBService.add(newItem).success(function(data) {
	    	  $log.debug(data);
	    	  //course.info.id= data.id;
	    	  $log.debug(course.info);
	    	  course.enrolledCourse.enroll = true;
	    	  $scope.hasButtonPress = false;
	      });
	    };
	 
	    course.cancel = function() {
	    	course.info.enroll = false;
	    	$scope.hasButtonPress = true;
		      DBService.deletR(course.enrolledCourse._id).success(function(data) {
		    	  $log.debug(data);
		    	  $scope.hasButtonPress = false;
		    	  if(data.ok){
		    		  course.enrolledCourse.enroll= false;   		  
		    	  }
		      });
	    };
	 
	    course.archive = function() {
	      var oldTodos = course.todos;
	      course.todos = [];
	      angular.forEach(oldTodos, function(todo) {
	        if (!todo.done) course.todos.push(todo);
	      });
	    };	    
	    
     })
   .config(function($routeProvider) {
//	  var resolveProjects = {
//			    projects: function (Projects) {
//			      return Projects.fetch();
//			    }
//			  };
			 
	  $routeProvider
	    .when('/', {
	      controller:'CourseController as courseList',
	      templateUrl:'partial/list.html'
//	      resolve: resolveProjects
	    })
	    .when('/enroll/:courseId', {
	      controller:'CourseController as enrollCourse',
	      templateUrl:'partial/enroll.html'
//	      resolve: resolveProjects
	    })
	    .otherwise({
	      redirectTo:'/'
	    });
	});
