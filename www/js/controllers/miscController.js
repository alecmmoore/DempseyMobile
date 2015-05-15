dempsey.controller('miscController',
    function miscController($scope, $timeout, dataService) {
        var self = this;
        self.state = 'new';
        self.isBusy = true;

        self.opponentGoals = 0;
        self.saves = 0;
        self.corners = 0;
        self.offsides = 0;

        $scope.$on('$ionicView.enter', function(event) {
           $timeout(function() {

               self.opponentGoals = dataService.getLocalGamesStatsByKey('opponentGoals')[0] || 0;
               self.saves = dataService.getLocalGamesStatsByKey('saves')[0] || 0;
               self.corners = dataService.getLocalGamesStatsByKey('corners')[0] || 0;
               self.offsides = dataService.getLocalGamesStatsByKey('offsides')[0] || 0;

               self.isBusy = false;
           });
        });

        self.addProp = function(prop) {
            if (self.hasOwnProperty(prop)) {
                self[prop] += 1;
                dataService.setLocalGameStats(prop, self[prop], true);
            }
        }

        self.subProp = function(prop) {
            if (self.hasOwnProperty(prop) && self[prop] > 0) {
                self[prop] -= 1;
                dataService.setLocalGameStats(prop, self[prop], true);
            }
        };

        self.edit = function() {
            if (self.state === 'new') {
                self.state = 'edit';
                return;
            }

            if (self.state === 'edit') {
                self.state = 'new';
            }
        }

    });