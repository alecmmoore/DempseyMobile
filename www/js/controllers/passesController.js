dempsey.controller('passesController',
    function passesController($scope, $timeout, $rootScope, configService, dataService) {
        var self = this;
        self.state = 'new';
        self.isBusy = true;


        $scope.players = [];
        $scope.bench = [];

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

                $timeout(function() {
                    // Load existing data from local storage
                    var localStats = dataService.getLocalGamesStatsByKey('passes');

                    _.each(localStats, function(item) {
                        $rootScope.$broadcast(configService.messages.loadPlayerCardData, { data: item });
                    });

                    self.isBusy = false;

                });

            });
        });

        self.statChanged = function(data) {
            // Pass complete
            dataService.setLocalGameStats('passes', data, true);
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