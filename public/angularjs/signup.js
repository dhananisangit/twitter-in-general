var signup=angular.module('signup',[]);
signup.controller('signup',function($scope,$http)
{
    $scope.registered_email=true;
    $scope.unexpected_error=true;
    $scope.submit=function()
    {console.log("HO");
        $http({
        	
            method:"POST",
            url:'/signuppage',
            data : {
                "fullName" : $scope.fullName,
                "emailID":$scope.emailID,
                "password" : $scope.password
            }

        }).success(function(data)
        {
            if (data.statusCode == 401) {
                $scope.registered_email = false;
                $scope.unexpected_error = true;
            }
            if(data.statusCode==200)
           {
        	   console.log("username");
        	   window.location.assign("/addUsername");
            }
        })
            .error(function(error) {
                $scope.unexpected_error = false;
                $scope.registered_email = true;
            });
    };
})