angular.module('palKpiApp', [])
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
  .controller('CourseController', function ($log,$scope, $http,DBService) {
	    var course = this;
	  	course.coursePool = {
	  			javadl:{title:"Java", location: "DL", text:'java fundamental', enroll:false},
	  			javacd:{title:"Java", location: "CD", text:'java fundamental', enroll:false},
	  			javawh:{title:"Java", location: "CD", text:'java fundamental', enroll:false}
	  	};

	  	course.info = course.coursePool[$scope.courseId];
	  	
	    $scope.hasButtonPress = false;
	    var id = $scope.userId + "-" + $scope.courseId;
	    DBService.fetch(id)
	    .success(function(data){
	    	$log.debug(data);
	    	if(data._id!=null){
	    		course.enrolledCourse = data;
	    	}else{
	    		course.enrolledCourse = course.info;
	    	}

	    	$log.debug(course.enrolledCourse);
	    });
	    
	    DBService.searchByCourseId($scope.courseId)
	    .success(function(data){
	    	$log.debug(data);
	    	if(data.total_rows> 0 ){
	    		course.courseList = data.rows;
		    	$log.debug(course.courseList);
	    	}
	    });
	    
//	    $log.debug($scope.courseId);
	    course.enroll = function() {
	      var newItem =	course.enrolledCourse;
	      newItem._id = id;
	      newItem.enroll = true;
	      newItem.userId = $scope.userId;
	      newItem.courseId = $scope.courseId;
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
  .controller('TodoListController', function ($scope, $http,DBService) {
//	    $http.get('phones/phones.json').success(function(data) {
//	      $scope.phones = data;
//	    });
//
//	    $scope.orderProp = 'age';
//	 ;
	    var todoList = this;
	    todoList.todos = [
	      {text:'learn angular', done:true},
	      {text:'build an angular app', done:false}];
	 
	    todoList.addTodo = function() {
	      var newItem =	{text:todoList.todoText, done:false}
	      DBService.add(newItem).success(function(data) {
		      todoList.todos.push(newItem);
		      todoList.todoText = '';
	    	  $log.debug(data);
	      })
	    };
	 
	    todoList.remaining = function() {
	      var count = 0;
	      angular.forEach(todoList.todos, function(todo) {
	        count += todo.done ? 0 : 1;
	      });
	      return count;
	    };
	 
	    todoList.archive = function() {
	      var oldTodos = todoList.todos;
	      todoList.todos = [];
	      angular.forEach(oldTodos, function(todo) {
	        if (!todo.done) todoList.todos.push(todo);
	      });
	    };	    
	    
	  });
