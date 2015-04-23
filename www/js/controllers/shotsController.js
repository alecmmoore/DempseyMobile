dempsey.controller('shotsController',
    function shotsController($scope, $window, $ionicScrollDelegate, viewService) {
        var self = this;

        self.state = 'new';

        self.currentShot = {
            takenBy: '',
            assistedBy: '',
            type: '',
            shotPos: {x: 50, y: 75},
            resultPos: {x: 50, y: 15}
        }

        // Shot Types: off, on, goal, blocked
        $scope.shots = [];

        // Shot counts
        $scope.on = 0;
        $scope.off = 0;
        $scope.blocked = 0;

        self.addShot = function(shot) {
            if (viewService.validateAreaByFormName('shotForm')) {
                // Increment shot type count
                if (shot.type === 'goal') {
                    $scope.on++;
                }
                else {
                    $scope[shot.type] += 1;
                    shot.assistedBy = '';
                }

                $scope.shots.push(angular.copy(shot));

                // Reset
                self.currentShot.shotPos = {x: 50, y: 75};
                self.currentShot.resultPos = {x: 50, y: 10};
            }
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

        self.deleteShot = function(shot) {
            // Increment shot type count
            if (shot.type === 'goal') {
                if ($scope.on > 0) {
                    $scope.on--;
                }
            }
            else {
                if ($scope[shot.type] > 0) {
                    $scope[shot.type] -= 1;
                }
            }

            $scope.shots.splice($scope.shots.indexOf(shot),1);
        }

        self.dragHandle = function(event, type) {
            $ionicScrollDelegate.freezeAllScrolls(true);

            var el = angular.element(document.getElementById("shots"))[0];
            var offset = el.getBoundingClientRect();
            var x = ((event.gesture.center.pageX + offset.left) / el.clientWidth) * 100;
            var y = ((event.gesture.center.pageY - offset.top) / el.clientHeight) * 100;

            console.log(y);

            // If x and y are within the bounds of the container
            if ( y >= 5 && y <= 100 && x >= 0 && x <= 100) {
                if (type === 'shot') {
                    self.currentShot.shotPos.x = x;
                    self.currentShot.shotPos.y = y;
                }

                if (type === 'result') {

                    self.currentShot.resultPos.x = x;
                    self.currentShot.resultPos.y = y;
                }
            }
        }

        self.onRelease = function() {
            $ionicScrollDelegate.freezeAllScrolls(false);
        }

    });