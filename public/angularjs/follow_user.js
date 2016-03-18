var followuser = angular.module('followuser', []);

followuser.controller('followuserCntrl', function($scope, $http){
	//$scope.username = as;
	$scope.follow = function(abc) {
		console.log(typeof abc + abc);
		console.log("ASDSAD");
		http({
			method : "GET",
			url : '/follow_user',
			data : {
				"user_followed": $scope.follow
			}
		}).success(function(data){
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
			}
			else
				window.location.assign("/homepage");
			
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
		});
	};
})