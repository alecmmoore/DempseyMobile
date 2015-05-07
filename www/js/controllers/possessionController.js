dempsey.controller('possessionController',
    function possessionController($scope, $timeout, dataService) {
        var self = this;
        self.isBusy = true;
        self.state = 'new';

        self.selected = 0;
        self.currentGame = {};

        self.possession = {
            data: 50
        };
        self.teamTime = 1;
        self.totalTime = 1;

        self.possessionEvents = [];

        $scope.$on('$ionicView.enter', function(event) {
            $timeout(function() {
                self.currentGame = dataService.getLocalGame();

                // Load existing data from local storage
                self.possessionEvents = dataService.getLocalGamesStatsByKey('possession');

                self.isBusy = false;

            });
        });

        self.getSelected = function(_selected) {
            return _selected === self.selected;
        }

        var startTime = 0;
        self.setSelected = function(_selected) {
            if (self.selected != _selected) {
                var time = new Date().getTime() / 1000;
                var timeEvent;

                if (self.possessionEvents.length > 0) {
                    var previousEvent = self.possessionEvents[0];

                    // Get the duration of possession
                    var newTime = Math.floor(time - previousEvent.timeStamp);

                    // Aggregate time
                    self.totalTime += newTime;

                    // If is my team then aggregate my teams time
                    if (!self.selected) {
                        self.teamTime += newTime;
                    }

                    // Add time event
                    timeEvent = {team: _selected, duration: newTime, timeStamp: time };
                    self.possessionEvents.unshift(timeEvent);
                }
                else {
                    // If this is the first event
                    startTime = time;
                    timeEvent = { team: _selected, duration: 0, timeStamp: time };
                    self.possessionEvents.push(timeEvent);

                }

                self.possession.data = Math.round((self.teamTime / self.totalTime) * 100);

                dataService.setLocalGameStats('possession', self.possession.data, true);
                self.selected = _selected;
            }
        }

        self.removeEvent = function(item) {
            self.possessionEvents.splice(item, 1);
            dataService.deleteLocalGameStatsItem('possession', item);
        }

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