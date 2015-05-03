dempsey.controller('subsController',
    function subsController($scope, $rootScope, $ionicModal) {
        var self = this;
        self.state = 'new';

        var dummyPlayer = {
            type: "P",
            name: "Player",
            num: 0
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
                var player1Index = -1, player2Index = -1;

                // Make copy so you can edit $scope.players in foreach
                var players = angular.copy($scope.players);
                _.each(players, function(item, index) {
                    // Todo: Change if to check for ID instead of num
                    if (item.data.num === $scope.player1.data.num) {
                        player1Index = index;
                    }
                    if (item.data.num === $scope.player2.data.num) {
                        player2Index =  index;
                    }
                });

                var player1 = $scope.players[player1Index];
                var temp = angular.copy(player1);
                var player2 = $scope.players[player2Index];

                // Switch the x, y and bench status of the players
                player1.data.bench = player2.data.bench;
                player1.data.x = player2.data.x;
                player1.data.y = player2.data.y;

                player2.data.bench = temp.data.bench;
                player2.data.x = temp.data.x;
                player2.data.y = temp.data.y;

                $scope.subs.push(
                    {
                        data: {
                            isSub: player1.data.bench || player2.data.bench,
                            player1: player1,
                            player2: player2
                        }
                    }
                );

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
            console.log(data);

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
            $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        $scope.players = [
            { data: {
                bench: false,
                type: "GK",
                name: 'Frei',
                num: 24,
                x: 38,
                y: 76
            }
            },
            { data: {
                bench: false,
                type: "LB",
                name: 'Gonzales',
                num: 12,
                x: 1,
                y: 52
            }
            },
            { data: {
                bench: false,
                type: "CB",
                name: 'Marshall',
                num: 14,
                x: 26,
                y: 52
            }
            },
            { data:{
                bench: false,
                type: "CB",
                name: 'Evans',
                num: 3,
                x: 51,
                y: 52
            }
            },
            { data:{
                bench: false,
                type: "RB",
                name: 'Mears',
                num: 4,
                x: 76,
                y: 52
            }
            },

            { data:{
                bench: false,
                type: "LM",
                name: 'Neagle',
                num: 27,
                x: 1,
                y: 28
            }
            },
            { data: {
                bench: false,
                type: "CAM",
                name: 'Pineda',
                num: 8,
                x: 26,
                y: 28
            }
            },
            { data:{
                bench: false,
                type: "CDM",
                name: 'Alonso',
                num: 6,
                x: 51,
                y: 28
            }
            },
            { data:{
                bench: false,
                type: "RM",
                name: 'Pappa',
                num: 10,
                x: 76,
                y: 28
            }
            },

            { data:{
                bench: false,
                type: "ST",
                name: 'Dempsey',
                num: 2,
                x: 26,
                y: 3
            }
            },
            { data:{
                bench: false,
                type: "ST",
                name: 'Martins',
                num: 9,
                x: 51,
                y: 3
            }
            },
            { data:{
                bench: true,
                type: "ST",
                name: 'Barret',
                num: 19
            }},
            { data:{
                bench: true,
                type: "LM",
                name: 'Kovar',
                num: 11
            }},
            { data:{
                bench: true,
                type: "RB",
                name: 'Fisher',
                num: 91
            }},
            { data:{
                bench: true,
                type: "ST",
                name: 'Mansaray',
                num: 80
            }},
            { data:{
                bench: true,
                type: "CM",
                name: 'Rose',
                num: 5
            }},

            { data:{
                bench: true,
                type: "CB",
                name: 'Scott',
                num: 20
            }},
            { data:{
                bench: true,
                type: "CM",
                name: 'Roldan',
                num: 7
            }}
        ];

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