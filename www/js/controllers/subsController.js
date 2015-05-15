dempsey.controller('subsController',
    function subsController($scope, $rootScope, $timeout, $ionicModal, dataService) {
        var self = this;
        self.state = 'new';
        self.isBusy = true;

        var skipLocalStorage = false;

        $scope.players = [];

        var dummyPlayer = {
            type: "P",
            name: "Player",
            jerseyNumber: 0
        }

        $scope.player1 = {
            isPlayer: false,
            data: dummyPlayer
        };

        $scope.player2 = {
            isPlayer: false,
            data: dummyPlayer
        };

        $scope.$on('$ionicView.enter', function(event) {
            var currentGame = dataService.getLocalGame();
            var positions = dataService.getPositions();

            // Todo: remove when the player object store the x and y val in the DB
            var posIndex = 0;

            _.each(currentGame.roster, function(_item, index) {
                var item = _item[Object.keys(_item)[0]];

                if (item.startingStatus && item.startingStatus === 'On') {

                    if (posIndex < positions.length) {
                        item.player.x = positions[item.posId].x;
                        item.player.y = positions[item.posId].y;
                        item.player.type = positions[item.posId].type;

                        posIndex += 1;
                    }

                    item.player.isBench = false;
                }
                else if (item.startingStatus && item.startingStatus === 'Off') {
                    item.player.x = 0;
                    item.player.y = 0;
                    item.player.isBench = true;
                    item.player.type = "P";
                }


                $scope.players.push({isPlayer: true, data: item.player});

            });

            $timeout(function() {

                // Load existing data from local storage
                var localData = dataService.getLocalGamesStatsByKey('subs');

                _.each(localData, function(item) {
                    $scope.player1 = item.data.player1;
                    $scope.player2 = item.data.player2;
                    self.makeSub(true);
                });

                skipLocalStorage = false;
                self.isBusy = false;
            });

        });

        $scope.subs = [];

        self.makeSub = function(skipLocalStorage, skipHistory) {
            if ($scope.player1.isPlayer && $scope.player2.isPlayer) {

                var player1 = _.find($scope.players, function(item) {
                    return item.data.objectId === $scope.player1.data.objectId;
                });

                var temp = JSON.parse(JSON.stringify(player1));
                var player2 = _.find($scope.players, function(item) {
                    return item.data.objectId === $scope.player2.data.objectId;
                });

                // Swap the x and y values and the bench status
                player1.data.x = player2.data.x;
                player1.data.y = player2.data.y;

                player2.data.x = temp.data.x ;
                player2.data.y = temp.data.y;

                player1.data.isBench = player2.data.isBench;
                player2.data.isBench = temp.data.isBench;

                var subObj =  {
                    data: {
                        isSub: (player1.data.isBench && !player2.data.isBench) || (!player1.data.isBench && player2.data.isBench),
                        player1: player1,
                        player2: player2,
                        timeStamp: new Date().getTime()
                    }
                };

                if (!skipHistory) {
                    $scope.subs.push(subObj);
                }

                // Don't commit to local storage if you loading the data on page load
                if (!skipLocalStorage) {
                    dataService.setLocalGameStats('subs', subObj);
                }

                self.resetSubs();
            }
            else {
                // Invalid
            }
        }

        self.resetSubs = function() {
            $scope.player1.data = dummyPlayer;
            $scope.player1.isPlayer = false;
            $scope.player2.data = dummyPlayer;
            $scope.player2.isPlayer = false;
        }

        self.subClicked = function(data) {
            // If the clicked player is already selected
            // then remove the player from the sub
            if ($scope.player1.isPlayer && $scope.player1.data === data) {
                $scope.player1.data = dummyPlayer;
                $scope.player1.isPlayer = false;
                return;
            }
            else if ($scope.player2.isPlayer && $scope.player2.data === data) {
                $scope.player2.data = dummyPlayer;
                $scope.player2.isPlayer = false;
                return;
            }

            // Select Players
            if (!$scope.player1.isPlayer) {
                $scope.player1.data = data;
                $scope.player1.isPlayer = true;
            }
            else {
                $scope.player2.data = data;
                $scope.player2.isPlayer = true;
            }
        }

        $scope.removeSub = function(sub) {

            self.subClicked(sub.data.player1.data);
            self.subClicked(sub.data.player2.data);

            self.makeSub(true, true);

            $scope.subs.splice(sub, 1);
            dataService.deleteLocalGameStatsItem('subs', sub);

        }

        $scope.openModal = function() {
            $scope.modal.show();
        };

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            if ($scope.modal) {
                $scope.modal.remove();
            }
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        self.edit = function() {
            // Edit Modal
            if ($scope.modal){
                $scope.openModal();
            }
            else {
                $ionicModal.fromTemplateUrl('views/modals/edit-subs-modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.openModal();
                });
            }

        }

    });