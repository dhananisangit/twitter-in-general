/**
 * New node file
 */
var hash = angular.module('hash', []);

hash.directive('parseHash', function($compile) {
  var pattern = /#([A-Za-z0-9\/\.]*)/ig;
  return {    
    restrict: 'A',    
    require: 'ngModel',
    replace: true,   
    scope: { hash: '=parseHash', ngModel: '=ngModel' },
    link: function compile(scope, element, attrs, controller) {         
        scope.$watch('ngModel', function(value) {         
            angular.forEach(value.match(pattern), function(hashstr) {
                value = value.replace(hashstr, "<a href=\"" + "\" ng-click='onClick()'>" + hashstr +"</a>");
            });

            var content = angular.element('<div></div>').html(value).contents();
            var compiled = $compile(content);
            element.html('');
            element.append(content);
            scope.onClick= function () {
                console.log('clicked');
            };
           
            compiled(scope)
          });                
    }
  };  
});

function hash($scope) {
    $scope.text = '';  
    $scope.hash = {        
        target: '_blank',
        otherProp: 'otherProperty'
    };
}

hash.controller('hash',function($scope,$http)
		{
		    $scope.display_tweets=true;
		  
		    $scope.insertTweet = function()
		    {
		    	$scope.display_tweets=false;
		    	
		    }
		})