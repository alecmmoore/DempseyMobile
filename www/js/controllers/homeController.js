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


        $scope.doSubmitStats = function() {
            console.log($scope.gameStats);
               return;
            var currentTeam = dataService.getLocalTeam();
            var currentGame = dataService.getLocalGame();
            console.log(currentGame);


            var gamePlayerStatsTable = Parse.Object.extend("GamePlayerStats");
            var gameTeamStatsTable = Parse.Object.extend("GameTeamStats");

            //var query = new Parse.Query(gamePlayerStatsTable);


            if ($scope.gameStats.corners) {
                currentGame.gameTeamStats.corners = $scope.gameStats.corners[0];
            }

            if ($scope.gameStats.offsides) {
                currentGame.gameTeamStats.offsides = $scope.gameStats.offsides[0];
            }

            if ($scope.gameStats.saves) {
                currentGame.gameTeamStats.saves = $scope.gameStats.saves[0];
            }

            if ($scope.gameStats.opponentGoals) {
                currentGame.gameTeamStats.goalsTaken = $scope.gameStats.opponentGoals[0];
            }

            // Add type and position to player shots array { type: x,
            // Aggregate player goals and assists
            // Update team goals
            if ($scope.gameStats.shots) {
                var teamGoals = 0;
                _.each($scope.gameStats.shots, function(item) {
                    var thisShot = {
                        type: item.type,
                        shotPos: item.shotPos,
                        resultPos: item.resultPos
                    };

                    currentGame.roster[item.takenBy.id].attributes.shots = currentGame.roster[item.takenBy.id].attributes.shots ? currentGame.roster[item.takenBy.id].attributes.shots : [];

                    currentGame.roster[item.takenBy.id].attributes.shots.addUnique(thisShot);

                    if (item.assistedBy) {
                        currentGame.roster[item.assistedBy.id].attributes.assists = currentGame.roster[item.assistedBy.id].attributes.assists ? currentGame.roster[item.assistedBy.id].attributes.assists + 1 : 1;
                    }

                    if (item.type === 'goal') {
                        currentGame.roster[item.takenBy.id].attributes.goals = currentGame.roster[item.takenBy.id].attributes.goals ? currentGame.roster[item.takenBy.id].attributes.goals + 1 : 1;
                        teamGoals++;
                    }
                });

                currentGame.gameTeamStats.attributes.goalsMade = teamGoals;
            }

            // Add to player { completed: x, total: y }
            // Add to team a count of completed passes
            if ($scope.gameStats.passes) {
                var teamPasses = 0;
                _.each($scope.gameStats.passes, function(item) {
                    var thisPass = {
                        completed: item.first,
                        total: item.second
                    };

                    currentGame.roster[item.player].attributes.passes = thisPass;

                    teamPasses += thisPass.completed;
                });

                currentGame.gameTeamStats.attributes.passes = teamPasses;
            }

            // Add to player cards { time: x, type: y }
            // Add to player foul count
            // Add to team a count of total fouls
            if ($scope.gameStats.fouls) {
                var teamFouls = 0;
                _.each($scope.gameStats.fouls, function(item) {
                    currentGame.roster[item.player].attributes.fouls = item.fouls;

                    currentGame.roster[item.player].attributes.cards = currentGame.roster[item.player].attributes.cards ? currentGame.roster[item.player].attributes.cards : [];
                    _.each(item.cards, function(item2) {
                        currentGame.roster[item.player].attributes.cards.push(item2);
                    });

                    teamFouls += item.fouls;
                });

                currentGame.gameTeamStats.attributes.fouls = teamFouls;
            }

            // Add to sub table: in: x, out: y, time: z  and add relation to GameTeamStatsTable
            // If he is subbed in, add timestamp to subbedIn array, same for subbedOut per player
            // Aggregate amount of minutes played to player
            //
            if ($scope.gameStats.subs) {
                _.each($scope.gameStats.subs, function(item) {
                    var subTable = Parse.Object.extend('Substitutions');
                    var subObj = new subTable();

                    subObj.set('isSub', item.data.isSub);

                    if (item.data.isSub) {
                        if (item.data.player1.data.isBench) {
                            subObj.set('subbedIn', item.data.player1.data.objectId);
                            subObj.set('subbedOut', item.data.player2.data.objectId);

                            currentGame.roster[item.data.player1.data.objectId].attributes.subbedIn = currentGame.roster[item.data.player1.data.objectId].attributes.subbedIn ? currentGame.roster[item.data.player1.data.objectId].attributes.subbedIn : [];
                            currentGame.roster[item.data.player2.data.objectId].attributes.subbedOut = currentGame.roster[item.data.player2.data.objectId].attributes.subbedOut ? currentGame.roster[item.data.player2.data.objectId].attributes.subbedOut : [];

                            currentGame.roster[item.data.player1.data.objectId].attributes.subbedIn.push(item.data.timeStamp);
                            currentGame.roster[item.data.player2.data.objectId].attributes.subbedOut.push(item.data.timeStamp);
                        }
                        else {
                            subObj.set('subbedOut', item.data.player1.data.objectId);
                            subObj.set('subbedIn', item.data.player2.data.objectId);

                            currentGame.roster[item.data.player2.data.objectId].attributes.subbedIn = currentGame.roster[item.data.player2.data.objectId].attributes.subbedIn ? currentGame.roster[item.data.player2.data.objectId].attributes.subbedIn : [];
                            currentGame.roster[item.data.player1.data.objectId].attributes.subbedOut = currentGame.roster[item.data.player1.data.objectId].attributes.subbedOut ? currentGame.roster[item.data.player1.data.objectId].attributes.subbedOut : [];

                            currentGame.roster[item.data.player2.data.objectId].attributes.subbedIn.push(item.data.timeStamp);
                            currentGame.roster[item.data.player1.data.objectId].attributes.subbedOut.push(item.data.timeStamp);
                        }

                        subObj.set('time', item.data.timeStamp);

                        subObj.save().then(function(sub) {

                            currentGame.gameTeamStats.attributes.substitutions = currentGame.gameTeamStats.attributes.substitutions ? currentGame.gameTeamStats.attributes.substitutions : [];
                            currentGame.gameTeamStats.attributes.substitutions.push(sub);

                        });

                    }

                });
            }

            // Add to player, tackles count
            // Add to team total tackles count
            if ($scope.gameStats.tackles) {
                var teamTackles = 0;
                _.each($scope.gameStats.tackles, function(item) {
                    currentGame.roster[item.player].attributes.tackles = item.first;
                    teamTackles += item.first;
                });

                currentGame.gameTeamStats.attributes.tackles = teamPasses;
            }

        }
    });