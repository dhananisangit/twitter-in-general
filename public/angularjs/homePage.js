var homePage = angular.module('homePage', []);
homePage.controller('homePage', function($scope, $http) {
	
	$http({
		method : "get",
		url : '/homepage1',
		
	}).then(function(res) {
	
		$scope.tweetshide=true;
		$scope.searchwadu=false;
		$scope.kapas = false;
		
		
	//	console.log($scope.tweetArray.tweetData.plainText+"YE mat dekho");
		$scope.tweets = res.data.tweets;
				
		$scope.users = res.data.users;
		
		$scope.tweet_time = res.data.tweet_time;

		$scope.name1 = res.data.name1;

		$scope.noTweet = res.data.noTweet;
		
		$scope.following = res.data.following;
		
		
		$scope.followers = res.data.followers;
		
		$scope.count = res.data.count;
		$scope.fullName = res.data.fullName;
			
	});
	
	$scope.retweet = function(data1) {
		console.log(data1);
		$http({
			method : "POST",
			url : '/retweet',
			data : {
				"tweetID" : data1
			}
		}).then(function() {
				
				window.location.assign("/homepage"); 
		});
	};
	
	$scope.searchtweet = function(){

		$http({
			method : "POST",
			url:'/search',
			data : {
				"search" : $scope.search
			}
			
		}).then(function(res){
			$scope.tweet = res.data.search_tweets;
			console.log($scope.tweet+"lendu");
			$scope.tweetshide=true;
			$scope.searchwadu=false;
		});
		
	};
	
	
	$scope.follow = function(data){
		console.log(data+"::kapsa")
		$http({
			method:"POST",
			url:'/follow_user',
			data:{
				"follow":data
			}
		}).then(function(){
			$scope.kapas = true;
			window.location.assign("/homepage"); 
		})
	}
	
	$scope.insertTweet = function(){
		console.log($scope.tweet_box);
		$http({
			method:"POST",
			url:'/insertTweet',
			data:{
				"tweet_box":$scope.tweet_box
			}
		}).then(function(){
			window.location.assign("/homepage"); 
		})
	}
	
	
})
