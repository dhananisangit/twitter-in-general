/**
 * New node file
 */
var profilePage = angular.module('profilePage', []);
profilePage.controller('profilePage', function($scope, $http) {
	
	$http({
		method : "get",
		url : '/profile',
		
	}).then(function(res) {
		$scope.locationhide = true;
		$scope.tweetspart = false;
		$scope.followingpart = true;
		$scope.followerspart = true;
		$scope.tweets = res.data.alltweets;
		console.log($scope.tweet+"::check it out");
		$scope.info = res.data.information;
		
		$scope.following = res.data.following;
		
		$scope.followers = res.data.follower;
		//console.log($scope.followers+"AHAHHA");
		$scope.count = res.data.tweet_count;
		
		$scope.f = res.data.nameFollowing;
		console.log($scope.f+":::***");
		
		$scope.f1 = res.data.nameFollowers;
					
	});
	
	$scope.editprofile = function(){
		console.log("HIHI");
		if($scope.locationhide==true){
		$scope.locationhide = false;
		}
		else{
			$scope.locationhide = true;
		}
	};
	
	$scope.showtweets = function(){
		console.log("HIHI");
		$scope.tweetspart = false;
		$scope.followingpart = true;
		$scope.followerspart = true;
		
	};
	
	$scope.showfollowing = function(){
		
		console.log("HIHIsadsa");
		$scope.tweetspart = true;
		$scope.followingpart = false;
		$scope.followerspart = true;
		
	};
	$scope.showfollowers = function(){
		console.log("dsadsadasHIHI");
		$scope.tweetspart = true;
		$scope.followingpart = true;
		$scope.followerspart = false;
		
	};

})



