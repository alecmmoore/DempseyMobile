dempsey.directive('playerCard', function () {
    return {
        restrict: 'E',
        templateUrl: './views/directives/playerCard.html',
        scope: {
            data: '=',
            isSub: '=?',
            subClicked: '&?',
            isFoul: '=?',
            isSecondStat: '=?',
            statChanged: '&?'
        },
        link: function(scope, elem, attrs) {
        },
        controller: function($scope, configService, $timeout) {

            $scope.firstStat = 0;
            $scope.secondStat = 0;
            $scope.cards = [];
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

                // If player card is keeping track of subs
                if ($scope.isSub && $scope.subClicked) { return; }

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

                    $scope.firstStat += 1;
                    $scope.cards.push({ time: new Date().getTime(), type: $scope.cardState});

                    $scope.updateParent();
                    return;
                }

                $scope.showSecond = true;
                $scope.secondStat += 1;
                $timeout(function() {
                    $scope.showSecond = false;
                }, 500);
            }


            $scope.$watchCollection('[firstStat, secondStat]', function(newVal, oldVal) {
                if (newVal === oldVal) { return; }

                if ($scope.statChanged) {
                    $scope.updateParent();
                }
            });

            // Listens for the state to change to edit or new and changes
            // the local variable
            $scope.$on('changeState', function(msg, data) {
                if (data.state) {
                    $scope.state = data.state;
                }
            });

            // Update parent with the current state of the player object to be committed to local storage
            $scope.updateParent = function() {

                if ($scope.isFoul) {
                    $scope.statChanged({data: { player: $scope.data.objectId, cards: $scope.cards,  fouls: parseInt($scope.firstStat), isRed: $scope.isRed, isYellow: $scope.isYellow } });
                    return;
                }

                if ($scope.isSecondStat) {
                    $scope.statChanged({data: { player: $scope.data.objectId, first: parseInt($scope.firstStat), second: parseInt($scope.secondStat) } });
                    return;
                }

                $scope.statChanged({data:  {player: $scope.data.objectId, first: parseInt($scope.firstStat) } });
            };

            // Fouls
            $scope.isCard = false;
            $scope.isYellow = false;
            $scope.isRed = false;
            $scope.cardState = 'yellow';
            $scope.removeCard = function() {
                $scope.isCard = false;
                $scope.isYellow = false;
                $scope.isRed = false;
                $scope.updateParent();
            }

            $scope.$on(configService.messages.loadPlayerCardData, function(msg, data) {
                if (data.data && data.data.player === $scope.data.objectId) {

                    if ($scope.isFoul) {
                        $scope.firstStat = data.data.fouls;
                        $scope.isYellow = data.data.isYellow;
                        $scope.isRed = data.data.isRed;
                        $scope.cards = data.data.cards;
                    }
                    else {
                        if (data.data.first) {
                            $scope.firstStat = data.data.first;
                        }

                        if (data.data.second) {
                            $scope.secondStat = data.data.second;
                        }
                    }
                }
            });

            // Message received from the fouls page
            // Indicates if the tap and hold should give a yellow or a red card to the player
            $scope.$on('cardStateChanged', function(msg, data) {
                if (data.state) {
                    $scope.cardState = data.state;
                }
            });



        }
    };
});
