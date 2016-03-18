var profile = angular.module('profile', []);

profile.controller('updateprofile', function($scope){
	$scope.updateProfile = true;
	$scope.update = function(){
		console.log("HEY");
		$scope.updateProfile = false;
	};
})