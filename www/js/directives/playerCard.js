dempsey.directive('playerCard', function () {
    return {
        restrict: 'E',
        templateUrl: './views/directives/playerCard.html',
        scope: {
            data: '=',
            isSub: '=?',
            isSecondStat: '=?'
        },
        link: function(scope, elem, attrs) {
        },
        controller: function($scope, $timeout) {

            $scope.firstStat = 0;
            $scope.secondStat = 0;
            $scope.state = 'new';

            // Increments the count for the primary statistic for the player
            $scope.addFirstStat = function() {
                if ($scope.state === 'edit') return;

                $scope.showFirst = true;
                $scope.firstStat += 1;

                if ($scope.isSecondStat) {
                    $scope.secondStat += 1;
                }

                $timeout(function() {
                    $scope.showFirst = false;
                }, 500);
            }

            // Increments the count for the secondary statistic for the player
            $scope.addSecondStat = function() {
                if ($scope.state === 'edit') return;

                $scope.showSecond = true;
                $scope.secondStat += 1;
                $timeout(function() {
                    $scope.showSecond = false;
                }, 500);
            }

            // Listens for the state to change to edit or new and changes
            // the local variable
            $scope.$on('changeState', function(msg, data) {
                if (data.state) {
                    $scope.state = data.state;
                }
            });

        }
    };
});
