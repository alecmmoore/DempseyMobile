dempsey.controller('homeController',
    function homeController($scope, $timeout, $ionicModal, toastService, dataService) {
        var self = this;

        self.currentGame = {};
        self.isBusy = true;

        $scope.$on('$ionicView.enter', function(event) {
            $timeout(function() {
                self.currentGame = dataService.getLocalGame();

                $scope.gameStats = dataService.getLocalGamesStats();

                $scope.possession = $scope.gameStats.possession && $scope.gameStats.possession.length;
                $scope.shots = $scope.gameStats.shots && $scope.gameStats.shots.length;
                $scope.passes = $scope.gameStats.passes && $scope.gameStats.passes.length;
                $scope.fouls = $scope.gameStats.fouls && $scope.gameStats.fouls.length;
                $scope.tackles = $scope.gameStats.tackles && $scope.gameStats.tackles.length;
                $scope.subs = $scope.gameStats.subs && $scope.gameStats.subs.length;
                $scope.misc = $scope.gameStats.corners || $scope.gameStats.offsides || $scope.gameStats.saves || $scope.gameStats.opponentGoals;

                self.isBusy = false;

            });
        });

        // Booleans of which stats to submit
       /* $scope.possession = false;
        $scope.shots = false;
        $scope.passes = false;
        $scope.fouls = false;
        $scope.tackles = false;
        $scope.subs = false;
        $scope.misc = false; */

        self.submitStats = function() {
            $ionicModal.fromTemplateUrl('views/modals/submit-stats-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.openModal();

            });
        }

        // EDIT MODAL
        $scope.toggleStat = function(key) {
            if ($scope.gameStats[key]) {
                $scope[key] = !$scope[key];
            }
            else {
                toastService.error('You have no data recorded for this statistic');
            }
        }

        $scope.editShot = function(shot) {
            $scope.selectedShot = shot;
        }

        $scope.openModal = function() {
            $scope.modal.show();
        };

        $scope.closeModal = function() {
            $scope.modal.hide();
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