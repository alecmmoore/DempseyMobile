dempsey.controller('foulsController',
    function foulsController($scope, $rootScope, $timeout, configService, dataService) {
        var self = this;
        self.state = 'new';

        $scope.players = [];
        $scope.bench = [];
        self.isBusy = true;


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
                        posIndex += 1;
                    }

                    $scope.players.push({data: item.player});

                }
                else if (item.startingStatus && item.startingStatus === 'Off') {
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