dempsey.controller('gamesController',
    function gamesController($scope, $timeout, dataService, viewService) {
        var self = this;

        //self.currentTeam = dataService.getCurrentTeam();

        self.teams = dataService.getLocalTeams();
        self.currentTeam = self.teams[0];

        var allGames = dataService.getLocalGames();
        self.games = [];

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
            self.selectTeam();
        });

        self.init = (function() {
            $timeout(function() {
                self.selectTeam();
            });
        })();

        self.doRefresh = function() {
            console.log('Refresh');

            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        }

        self.logout = function() {
            viewService.logOut();
            viewService.goToPage('/login')
        };
    });