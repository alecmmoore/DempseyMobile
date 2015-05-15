dempsey.controller('timeController',
    function timeController($scope, $timeout, $interval, toastService, dataService) {
        var self = this;
        self.state = 'new';

        self.currentGame = {};

        self.currentTime = 1;

        // Object that holds the half start and end time
        self.time = {
            firstStart: 0,
            firstEnd: 0,
            secondStart: 0,
            secondEnd: 0
        };

        self.isBusy = true;

        var timer;
        $scope.$on('$ionicView.enter', function(event) {
            var items = dataService.getLocalGamesStatsByKey('time');

            // When the view enters, load the saved time data from local storage
            if (items[0]) {

                if (items[0].firstStart != undefined) {
                    self.time.firstStart = moment.utc(items[0].firstStart).toDate();

                    timer = $interval(function () {
                        self.setCurrentTime();
                    }, 1000);
                }

                if (items[0].firstEnd != undefined) {
                    self.time.firstEnd = moment.utc(items[0].firstEnd).toDate();
                }

                if (items[0].secondStart != undefined) {
                    self.time.secondStart = moment.utc(items[0].secondStart).toDate();
                }

                if (items[0].secondEnd != undefined) {
                    self.time.secondEnd = moment.utc(items[0].secondEnd).toDate();
                }

            }

            // At the end of digest cycle, load the current gaem
            $timeout(function() {
               self.currentGame = dataService.getLocalGame();
               self.isBusy = false;
           });
        });

        // Sets the time based on the property passed in from the click event
        self.setTime = function(prop) {
            if (self.time[prop] !== undefined) {
                self.time[prop] = new Date();
                dataService.setLocalGameStats('time', self.time, true);
            }
        }

        self.setCurrentTime = function() {
            var now = new Date();
            var then, time;

            // Check if the game is over
            if (self.time.secondEnd != undefined) {
                then = self.time.secondEnd;
                time = moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("mm:ss");

                if (moment(then).unix() < moment(now).unix()) {
                    self.currentTime = 'FT';
                    return;
                }
            }

            // If second half has started
            if (self.time.secondStart) {
                then = self.time.secondStart;
                time = moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("mm:ss");
                self.currentTime = parseInt(time.split(':')[0]) + 45;
            }
            else {
                then = self.time.firstStart;
                time = moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("mm:ss");
                self.currentTime = time.split(':')[0];
            }

        }

        var checkHalfLength = function(start, end) {
            // Make sure the first half is at least 45 minutes
            var time = moment.duration(moment(start,"DD/MM/YYYY HH:mm:ss").diff(moment(end,"DD/MM/YYYY HH:mm:ss")));
            var halfLength = Math.round(Math.abs(time.asMinutes()));

            if (halfLength >= 45) {
                return true;
            }
            else {
                toastService.error('The half length must be at least 45 minutes');
                return false;
            }
        }

        $scope.$watch(function() {
            return self.time.firstStart;
        }, function(newVal, oldVal) {
            if (newVal === oldVal) { return; }

            if (checkHalfLength(newVal, self.time.firstEnd)) {
                dataService.setLocalGameStats('time', self.time, true);
            }

        });

        $scope.$watch(function() {
            return self.time.firstEnd;
        }, function(newVal, oldVal) {
            if (newVal === oldVal) { return; }

            if (checkHalfLength(self.time.firstStart, newVal)) {
                dataService.setLocalGameStats('time', self.time, true);
            }

        });

        $scope.$watch(function() {
            return self.time.secondStart;
        }, function(newVal, oldVal) {
            if (newVal === oldVal) { return; }

            if (checkHalfLength(newVal, self.time.secondEnd)) {
                dataService.setLocalGameStats('time', self.time, true);
            }

        });

        $scope.$watch(function() {
            return self.time.secondEnd;
        }, function(newVal, oldVal) {
            if (newVal === oldVal) { return; }

            if (checkHalfLength(self.time.secondStart, newVal)) {
                dataService.setLocalGameStats('time', self.time, true);
            }

        });

        $scope.$on('$destroy', function() {
            if(angular.isDefined(timer)) {
                $interval.cancel(timer);
                timer = undefined;
            }
        });


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