dempsey.controller('foulsController',
    function foulsController($scope, $rootScope) {
        var self = this;
        self.state = 'new';

        $scope.players = [
            { data: {
                type: "GK",
                name: 'Frei',
                num: 24,
                x: 38,
                y: 76
            }
            },
            { data: {
                type: "CB",
                name: 'Gonzales',
                num: 12,
                x: 1,
                y: 52
            }
            },
            { data: {
                type: "CB",
                name: 'Marshall',
                num: 14,
                x: 26,
                y: 52
            }
            },
            { data:{
                type: "CB",
                name: 'Evans',
                num: 3,
                x: 51,
                y: 52
            }
            },
            { data:{
                type: "CB",
                name: 'Mears',
                num: 4,
                x: 76,
                y: 52
            }
            },

            { data:{
                type: "CM",
                name: 'Neagle',
                num: 27,
                x: 1,
                y: 28
            }
            },
            { data: {
                type: "CM",
                name: 'Pineda',
                num: 8,
                x: 26,
                y: 28
            }
            },
            { data:{
                type: "CM",
                name: 'Alonso',
                num: 6,
                x: 51,
                y: 28
            }
            },
            { data:{
                type: "CM",
                name: 'Pappa',
                num: 10,
                x: 76,
                y: 28
            }
            },

            { data:{
                type: "ST",
                name: 'Dempsey',
                num: 2,
                x: 26,
                y: 3
            }
            },
            { data:{
                type: "ST",
                name: 'Martins',
                num: 9,
                x: 51,
                y: 3
            }
            }
        ];

        $scope.bench = [
            { data:{
                type: "ST",
                name: 'Barret',
                num: 19
            }},
            { data:{
                type: "LM",
                name: 'Kovar',
                num: 11
            }},
            { data:{
                type: "RB",
                name: 'Fisher',
                num: 91
            }},
            { data:{
                type: "ST",
                name: 'Mansaray',
                num: 80
            }},
            { data:{
                type: "CM",
                name: 'Rose',
                num: 5
            }},

            { data:{
                type: "CB",
                name: 'Scott',
                num: 20
            }},
            { data:{
                type: "CM",
                name: 'Roldan',
                num: 7
            }}
        ];

        self.isYellow = 1;
        self.setCard = function(card) {
            self.isYellow = card;
            // Received in playerCard.js for when the foul card state changes
            $rootScope.$broadcast('cardStateChanged', {state: card ? 'yellow' : 'red'});
        }

        self.edit = function() {
            if (self.state === 'new') {
                self.state = 'edit';
                // Received in playerCard.js for when the edit state changes
                $rootScope.$broadcast('changeState', {state: 'edit'});
                return;
            }

            if (self.state === 'edit') {
                // Received in playerCard.js for when the edit state changes
                $rootScope.$broadcast('changeState', {state: 'new'});
                self.state = 'new';
            }

        }

    });