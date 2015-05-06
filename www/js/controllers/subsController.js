dempsey.controller('subsController',
    function subsController($scope, $rootScope, $ionicModal, dataService) {
        var self = this;
        self.state = 'new';
        self.isBusy = true;

        $scope.players = [];

        $scope.$on('$ionicView.enter', function(event) {
            var allPlayers = dataService.getLocalPlayers(true);
            var positions = dataService.getPositions();
            _.each(allPlayers, function(item, index) {
                var isBench = false;
                if (index < positions.length) {
                    item.player.isBench = false;

                    item.player.x = positions[index].x;
                    item.player.y = positions[index].y;
                    item.player.type = positions[index].type;
                }
                else {
                    item.player.isBench = true;

                    item.player.x = 0;
                    item.player.y = 0;
                    item.player.type = 'P';
                }

                $scope.players.push({ isPlayer: true, data: item.player });

            });

            // Load existing data from local storage
            var localData = dataService.getLocalGamesStatsByKey('subs');

            self.isBusy = false;
        });

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

        $scope.subs = [];

        self.makeSub = function() {
            if ($scope.player1.isPlayer && $scope.player2.isPlayer) {

                var player1 = _.find($scope.players, function(item) {
                    return item.data.objectId === $scope.player1.data.objectId;
                });

                var temp = JSON.parse(JSON.stringify(player1));
                var player2 = _.find($scope.players, function(item) {
                    return item.data.objectId === $scope.player2.data.objectId;
                });

                // Swap the x and y values and the bench status
                player1.data.x = player2.data.x ;
                player1.data.y = player2.data.y;

                player2.data.x = temp.data.x ;
                player2.data.y = temp.data.y;

                player1.data.isBench = player2.data.isBench;
                player2.data.isBench = temp.data.isBench;

                var subObj =  {
                    data: {
                        isSub: player1.data.isBench || player2.data.isBench,
                        player1: player1,
                        player2: player2,
                        timeStamp: new Date().getTime()
                    }
                };

                $scope.subs.push(subObj);

                dataService.setLocalGameStats('subs', subObj);

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
            $scope.subs.splice(sub, 1);
            dataService.deleteLocalGameStatsItem('subs', sub);
            // todo: Return player back to position
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