dempsey.controller('playersController',
    function playersController($scope, $timeout, $interval, toastService, dataService) {
        var self = this;
        self.isBusy = true;

        self.players = [];

        $scope.$on('$ionicView.enter', function(event) {

            $timeout(function() {
                self.players = dataService.getLocalPlayers(true);
                self.isBusy = false;
           });
        });

        self.currentPlayer = {};

        self.setSelected = function(player) {
            self.currentPlayer = player;
        }

        self.isSelected = function(player) {
            return player === self.currentPlayer;
        }
    });