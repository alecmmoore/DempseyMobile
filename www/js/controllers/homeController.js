dempsey.controller('homeController',
    function homeController($scope, $timeout, $ionicModal, viewService, toastService, dataService) {
        var self = this;

        self.currentGame = {};
        self.isBusy = true;

        $scope.$on('$ionicView.enter', function(event) {
            $timeout(function() {
                self.currentGame = dataService.getLocalGame();

                $scope.gameStats = dataService.getLocalGamesStats();

                $scope.time = $scope.gameStats.time && $scope.gameStats.time.length;
                $scope.possession = $scope.gameStats.possession && $scope.gameStats.possession.length;
                $scope.shots = $scope.gameStats.shots && $scope.gameStats.shots.length;
                $scope.passes = $scope.gameStats.passes && $scope.gameStats.passes.length;
                $scope.fouls = $scope.gameStats.fouls && $scope.gameStats.fouls.length;
                $scope.tackles = $scope.gameStats.tackles && $scope.gameStats.tackles.length;
                $scope.subs = $scope.gameStats.subs && $scope.gameStats.subs.length;
                $scope.misc = $scope.gameStats.corners || $scope.gameStats.offsides || $scope.gameStats.saves || $scope.gameStats.opponentGoals;
                $scope.corners = $scope.gameStats.corners;
                $scope.offsides = $scope.gameStats.offsides;
                $scope.saves = $scope.gameStats.saves;
                $scope.opponentGoals = $scope.gameStats.opponentGoals;

                self.isBusy = false;

            });
        });

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
                if ($scope[key]) {
                    $scope[key] = undefined;
                }
                else {
                    $scope[key] = $scope.gameStats[key];

                }
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
            var currentTeam = dataService.getLocalTeam();
            var currentGame = dataService.getLocalGame();

            var currentRoster = {};

            _.each(currentGame.roster, function(item) {
                _.extend(currentRoster, item);
            });

            var gameTable = Parse.Object.extend("Game");
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
                currentGame.opponent.score = $scope.gameStats.opponentGoals[0];
            }

            if ($scope.gameStats.possession) {
                currentGame.gameTeamStats.possession = $scope.gameStats.possession[0];
            }

            if ($scope.time) {
                currentGame.startTime = $scope.gameStats.time[0].firstStart;
                currentGame.halfTimeEnd = $scope.gameStats.time[0].firstEnd;
                currentGame.halfTimeStart = $scope.gameStats.time[0].secondStart;
                currentGame.endTime = $scope.gameStats.time[0].secondEnd;
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


                    var takenById = item.takenBy.player.objectId;
                    if (currentRoster[takenById]) {

                        currentRoster[takenById].shots = currentRoster[takenById].shots ? currentRoster[takenById].shots : [];

                        if (item.assistedBy) {
                            var assistedBy = item.assistedBy.player.objectId;
                            _.extend(thisShot, {'assistedBy': item.assistedBy.player.objectId});
                            currentRoster[assistedBy].assists = currentRoster[assistedBy].assists ? currentRoster[assistedBy].assists + 1 : 1;
                        }

                        currentRoster[takenById].shots.push(thisShot);

                        if (item.type === 'goal') {
                            currentRoster[takenById].goals = currentRoster[takenById].goals ? currentRoster[takenById].goals + 1 : 1;
                            teamGoals++;
                        }
                    }

                });

                currentGame.gameTeamStats.goalsMade = teamGoals;
                currentGame.team.score = teamGoals;

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

                    currentRoster[item.player].passes = thisPass;

                    teamPasses += thisPass.completed;
                });

                currentGame.gameTeamStats.passes = teamPasses;
            }

            // Add to player cards { time: x, type: y }
            // Add to player foul count
            // Add to team a count of total fouls
            if ($scope.gameStats.fouls) {
                var teamFouls = 0;
                _.each($scope.gameStats.fouls, function(item) {
                    currentRoster[item.player].fouls = item.fouls;

                    currentRoster[item.player].cards = currentRoster[item.player].cards ? currentRoster[item.player].cards : [];
                    _.each(item.cards, function(item2) {
                        currentRoster[item.player].cards.push(item2);
                    });

                    teamFouls += item.fouls;
                });

                currentGame.gameTeamStats.fouls = teamFouls;
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

                    var player1 = {
                        __type: "Pointer",
                        className: "Players",
                        objectId: item.data.player1.data.objectId
                    };

                    var player2 = {
                        __type: "Pointer",
                        className: "Players",
                        objectId: item.data.player2.data.objectId
                    };


                    if (item.data.isSub) {
                        if (item.data.player1.data.isBench) {

                            currentRoster[item.data.player1.data.objectId].subbedIn = currentRoster[item.data.player1.data.objectId].subbedIn ? currentRoster[item.data.player1.data.objectId].subbedIn : [];
                            currentRoster[item.data.player2.data.objectId].subbedOut = currentRoster[item.data.player2.data.objectId].subbedOut ? currentRoster[item.data.player2.data.objectId].subbedOut : [];

                            subObj.set('subbedOut', player1);
                            subObj.set('subbedIn', player2);

                            currentRoster[item.data.player1.data.objectId].subbedIn.push(item.data.timeStamp);
                            currentRoster[item.data.player2.data.objectId].subbedOut.push(item.data.timeStamp);
                        }
                        else {

                            currentRoster[item.data.player2.data.objectId].subbedIn = currentRoster[item.data.player2.data.objectId].subbedIn ? currentRoster[item.data.player2.data.objectId].subbedIn : [];
                            currentRoster[item.data.player1.data.objectId].subbedOut = currentRoster[item.data.player1.data.objectId].subbedOut ? currentRoster[item.data.player1.data.objectId].subbedOut : [];

                            subObj.set('subbedOut', player2);
                            subObj.set('subbedIn', player1);

                            currentRoster[item.data.player2.data.objectId].subbedIn.push(item.data.timeStamp);
                            currentRoster[item.data.player1.data.objectId].subbedOut.push(item.data.timeStamp);
                        }

                        subObj.set('timeStamp', item.data.timeStamp.toString());

                        subObj.save().then(function(sub) {

                            currentGame.gameTeamStats.substitutions = currentGame.gameTeamStats.substitutions ? currentGame.gameTeamStats.substitutions : [];
                            currentGame.gameTeamStats.substitutions.push(sub);

                        }, function(obj,error){
                            console.log(obj);
                            console.log("Error saving game: " + error.code + " " + error.message);
                        });

                    }

                });
            }

            // Add to player, tackles count
            // Add to team total tackles count
            if ($scope.gameStats.tackles) {
                var teamTackles = 0;
                _.each($scope.gameStats.tackles, function(item) {
                    currentRoster[item.player].tackles = item.first;
                    teamTackles += item.first;
                });

                currentGame.gameTeamStats.tackles = teamPasses;
            }

            var query;
            // Update Game class
            query = new Parse.Query(gameTable);
            query.include("gameTeamStats");
            query.include("gameTeamStats.roster");
            //query.equalTo("objectId", currentGame.id);
            query.get(currentGame.id).then(function(item) {

                console.log(item);
                // set status, times
                item.set("status", "review");

                if ($scope.time) {
                    item.set("startTime", currentGame.startTime);
                    item.set("halfTimeEnd", currentGame.halfTimeEnd);
                    item.set("halfTimeStart", currentGame.halfTimeStart);
                    item.set("endTime", currentGame.endTime);
                }

                return item.save();

            }).then(function(item) {
                // Update Each Game Team Stats

                var gameTeamStats = item.get("gameTeamStats");

                if (currentGame.gameTeamStats.corners != undefined) {
                    gameTeamStats.set("corners", currentGame.gameTeamStats.corners);
                }

                if (currentGame.gameTeamStats.fouls != undefined) {
                    gameTeamStats.set("fouls", currentGame.gameTeamStats.fouls);
                }

                if (currentGame.gameTeamStats.goalsMade != undefined) {
                    gameTeamStats.set("goalsMade", currentGame.gameTeamStats.goalsMade);
                }

                if (currentGame.gameTeamStats.substitutions != undefined && currentGame.gameTeamStats.substitutions.length) {
                    _.each(currentGame.gameTeamStats.substitutions, function(item) {
                        gameTeamStats.addUnique("substitutions", item);
                    });
                }

                if (currentGame.gameTeamStats.goalsTaken != undefined) {
                    gameTeamStats.set("goalsTaken", currentGame.gameTeamStats.goalsTaken);
                }

                if (currentGame.gameTeamStats.tackles != undefined) {
                    gameTeamStats.set("tackles", currentGame.gameTeamStats.tackles);
                }

                if (currentGame.gameTeamStats.saves != undefined) {
                    gameTeamStats.set("saves", currentGame.gameTeamStats.saves);
                }

                if (currentGame.gameTeamStats.possession != undefined) {
                    gameTeamStats.set("possession", currentGame.gameTeamStats.possession);
                }

                if (currentGame.gameTeamStats.passes != undefined) {
                    gameTeamStats.set("passes", currentGame.gameTeamStats.passes);
                }

                if (currentGame.gameTeamStats.offsides != undefined) {
                    gameTeamStats.set("offsides", currentGame.gameTeamStats.offsides);
                }

                return gameTeamStats.save();

            }, function(error) {
                console.log(error);
            }).then(function(item) {

                // Update Each Game Player Stats

                var roster = item.get("roster");

                var promises = [];

                _.each(roster, function() {
                    promises.push(new Parse.Promise());
                });

                _.each(roster, function(gamePlayerStats, index) {

                    var playerId = gamePlayerStats.get("player").id;

                    console.log('gamePlayerStats');
                    console.log(playerId);
                    console.log(currentRoster[playerId]);

                    if (currentRoster[playerId].assists) {
                        gamePlayerStats.set("assists", currentRoster[playerId].assists);
                    }

                    if (currentRoster[playerId].fouls) {
                        gamePlayerStats.set("fouls", currentRoster[playerId].fouls);
                    }

                    if (currentRoster[playerId].cards && currentRoster[playerId].cards.length) {
                        _.each(currentRoster[playerId].cards, function(card) {
                            gamePlayerStats.addUnique("cards", card);
                        });
                    }

                    if (currentRoster[playerId].shots && currentRoster[playerId].shots.length) {
                        _.each(currentRoster[playerId].shots, function(shot) {
                            gamePlayerStats.addUnique("shots", shot);
                        });
                    }

                    if (currentRoster[playerId].tackles) {
                        gamePlayerStats.set("tackles", currentRoster[playerId].tackles);
                    }

                    if (currentRoster[playerId].passes) {
                        gamePlayerStats.set("passes", currentRoster[playerId].passes);
                    }

                    if (currentRoster[playerId].subbedIn && currentRoster[playerId].subbedIn.length) {
                        gamePlayerStats.set("subbedIn", currentRoster[playerId].subbedIn);
                    }

                    if (currentRoster[playerId].subbedOut && currentRoster[playerId].subbedOut.length) {
                        gamePlayerStats.set("subbedOut", currentRoster[playerId].subbedOut);
                    }

                    // Complete promise
                    gamePlayerStats.save().then(function(item) {
                        promises[index].resolve(true);
                    });
                });

                return Parse.Promise.when(promises);

            }, function(error) {
                console.log(error);
            }).then(function(item) {
                toastService.success('Stats have been submitted!');
                $scope.closeModal();
                viewService.goToPage('/games');
            });
        }
    });