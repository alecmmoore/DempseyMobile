dempsey.controller('tacklesController',
    function tacklesController($scope, $timeout, $rootScope, configService, dataService) {
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
                var localStats = dataService.getLocalGamesStatsByKey('tackles');

                _.each(localStats, function(item) {
                    $rootScope.$broadcast(configService.messages.loadPlayerCardData, { data: item });
                });

                self.isBusy = false;

            });

        });

        self.statChanged = function(data) {
            // tackle made
            dataService.setLocalGameStats('tackles', data, true);
        };

        self.edit = function() {
            if (self.state === 'new') {
                self.state = 'edit';
                $rootScope.$broadcast('changeState', {state: 'edit'});
                return;
            }

            if (self.state === 'edit') {
                $rootScope.$broadcast('changeState', {state: 'new'});
                self.state = 'new';
            }

        }

    });