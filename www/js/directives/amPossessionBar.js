dempsey.directive('amPossessionBar', function () {
    return {
        restrict: 'E',
        templateUrl: './views/directives/amPossessionBar.html',
        scope: {
            data: '='
        },
        link: function(scope, elem, attrs) {
            scope.init(elem);
        },
        controller: function($scope) {

            $scope.init = function(elem) { }

        }
    };
});
