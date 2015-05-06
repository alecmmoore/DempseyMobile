dempsey.controller('shotsController',
    function shotsController($scope, $timeout, $window, $ionicScrollDelegate, $ionicModal, viewService, dataService) {
        var self = this;

        self.state = 'new';

        self.currentShot = {
            takenBy: '',
            assistedBy: '',
            type: 'goal',
            shotPos: {x: 50, y: 75},
            resultPos: {x: 50, y: 15}
        }

        // Shot Types: off, on, goal, blocked
        $scope.shots = [];
        $scope.players = [];

        // Shot counts
        $scope.on = 0;
        $scope.off = 0;
        $scope.blocked = 0;

        $scope.$on('$ionicView.enter', function(event) {

            // Load players
            $scope.players = dataService.getLocalPlayers(true);
            console.log($scope.players);

            $timeout(function() {

                // Load existing data from local storage
                $scope.shots = dataService.getLocalGamesStatsByKey('shots');

                _.each($scope.shots, function(item) {
                    // Increment shot type count
                    if (item.type === 'goal') {
                        $scope.on++;
                    }
                    else {
                        $scope[item.type] += 1;
                    }
                });

                self.isBusy = false;

            });

        });

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
                var thisShot = angular.copy(shot);
                $scope.shots.push(thisShot);

                // Serialize to local storage
                dataService.setLocalGameStats('shots', thisShot);

                // Reset
                self.currentShot.shotPos = {x: 50, y: 75};
                self.currentShot.resultPos = {x: 50, y: 10};
            }
        }

        self.edit = function() {
            if (self.state === 'new') {
                self.state = 'edit';
                $ionicModal.fromTemplateUrl('views/modals/edit-shots-modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.openModal();
                });
                return;
            }

            if (self.state === 'edit') {
                self.state = 'new';
            }

        }

        $scope.deleteShot = function(shot) {
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
            dataService.deleteLocalGameStatsItem('shots', shot);
            $timeout(function() {
                $scope.selectedShot = {};
            });

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

        // EDIT MODAL
        $scope.selectedShot = {};

        $scope.editShot = function(shot) {
            $scope.selectedShot = shot;
        }

        $scope.openModal = function() {
            $scope.modal.show();
        };

        $scope.closeModal = function() {
            $scope.modal.hide();
            self.edit();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            if ($scope.modal) {
                $scope.modal.remove();
            }
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });


    });