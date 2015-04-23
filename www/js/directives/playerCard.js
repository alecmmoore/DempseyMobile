dempsey.directive('playerCard', function () {
    return {
        restrict: 'E',
        templateUrl: './views/directives/playerCard.html',
        scope: {
            sub: '=?',
            name: '=?',
            num: '=?',
            isSecondStat: '=?'
        },
        link: function(scope, elem, attrs) {
            scope.init(elem);
        },
        controller: function($scope, $timeout) {

            $scope.firstStat = 0;
            $scope.secondStat = 0;
            $scope.state = 'new';

            console.log($scope.isSecondStat);

            $scope.init = function(elem) { }

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

            $scope.addSecondStat = function() {
                if ($scope.state === 'edit') return;

                $scope.showSecond = true;
                $scope.secondStat += 1;
                $timeout(function() {
                    $scope.showSecond = false;
                }, 500);
            }

            $scope.$on('changeState', function(msg, data) {
                if (data.state) {
                    $scope.state = data.state;
                }
            });

        }
    };
});
