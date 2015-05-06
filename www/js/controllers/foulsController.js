dempsey.controller('foulsController',
    function foulsController($scope, $rootScope, $timeout, configService, dataService) {
        var self = this;
        self.state = 'new';

        $scope.players = [];
        $scope.bench = [];
        self.isBusy = true;


        $scope.$on('$ionicView.enter', function(event) {
            var allPlayers = dataService.getLocalPlayers(true);
            var positions = dataService.getPositions();
            _.each(allPlayers, function(item, index) {
                if (index < positions.length) {
                    item.player.x = positions[index].x;
                    item.player.y = positions[index].y;
                    $scope.players.push({data: item.player});
                }
                else {
                    $scope.bench.push({data: item.player});
                }
            });

            $timeout(function() {
                // Load existing data from local storage
                var localStats = dataService.getLocalGamesStatsByKey('fouls');

                _.each(localStats, function(item) {
                    $rootScope.$broadcast(configService.messages.loadPlayerCardData, { data: item });
                });

                self.isBusy = false;

            });

        });

        self.isYellow = 1;
        self.setCard = function(card) {
            self.isYellow = card;
            // Received in playerCard.js for when the foul card state changes
            $rootScope.$broadcast('cardStateChanged', {state: card ? 'yellow' : 'red'});
        }

        self.statChanged = function(data) {
            // Foul committed
            dataService.setLocalGameStats('fouls', data, true);
        };

        self.edit = function() {
            if (self.state === 'new') {
                self.state = 'edit';
                // Received in playerCard.js for when the edit state changes
                $rootScope.$broadcast('changeState', {state: 'edit'});
                return;
            }

            if (self.state === 'edit') {
                // Received in playerCard.js for when the edit state changes
                $rootScope.$broadcast('changeState', {state: 'new'});
                self.state = 'new';
            }

        }

    });