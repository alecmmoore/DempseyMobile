dempsey.controller('gamesController',
    function gamesController($scope, $timeout, dataService, viewService, $ionicSideMenuDelegate) {
        var self = this
          , allGames = [];
        //self.currentTeam = dataService.getCurrentTeam();

        $scope.$on('$ionicView.enter', function(event) {
            self.init();
        });

        self.toggleDrawer = function() {
            $ionicSideMenuDelegate.toggleLeft();
        }

        self.selectTeam = function() {
            self.games = [];
            _.each(allGames, function(item) {
                if (item.teamId === self.currentTeam.objectId) {
                    self.games.push(item.games);
                }
            });
        };

        self.selectGame = function(game) {
            dataService.setLocalGame(game);
            viewService.goToPage('/index');
        };

        $scope.$watch(function() {
            return self.currentTeam;
        }, function(newVal, oldVal) {
            if (newVal === oldVal) { return; }
            dataService.setLocalTeam(self.currentTeam);
            self.selectTeam();
        });

        self.init = function() {
            $timeout(function() {
                self.teams = dataService.getLocalTeams();
                self.currentTeam = self.teams[0];

                allGames = dataService.getLocalGames();
                self.games = [];

                dataService.setLocalTeam(self.currentTeam);
                self.selectTeam();
            });
        };

        self.doRefresh = function() {
            self.isBusy = true;
            // Reloads and re-queries the data
            dataService.clearLocalStorage();
            dataService.init(function() {

                self.init();
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
                self.isBusy = false;
            });

        };

    });