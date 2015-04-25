dempsey.directive('playerCard', function () {
    return {
        restrict: 'E',
        templateUrl: './views/directives/playerCard.html',
        scope: {
            data: '=',
            isSub: '=?',
            subClicked: '&?',
            isFoul: '=?',
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

                // If player card is keeping track of subs
                if ($scope.isSub && $scope.subClicked) {
                    $scope.subClicked({data: $scope.data});
                    return;
                }

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

                // If player card is keeping track of fouls
                // make the tap and hold toggle to cards
                if ($scope.isFoul) {
                    if ($scope.cardState === 'yellow' && $scope.isYellow) {
                        $scope.isYellow = true;
                        $scope.isRed = true;
                    }
                    else if ($scope.cardState === 'yellow') {
                        $scope.isYellow = true;
                        $scope.isRed = false;
                    }
                    else {
                        $scope.isYellow = false;
                        $scope.isRed = true;

                    }
                    return;
                }

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

            // Fouls
            $scope.isCard = false;
            $scope.isYellow = false;
            $scope.isRed = false;
            $scope.cardState = 'yellow';
            $scope.removeCard = function() {
                $scope.isCard = false;
                $scope.isYellow = false;
                $scope.isRed = false;
            }

            $scope.$on('cardStateChanged', function(msg, data) {
                if (data.state) {
                    $scope.cardState = data.state;
                }
            });



        }
    };
});
