dempsey.controller('subsController',
    function subsController($scope, $rootScope) {
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
                type: "LB",
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
                type: "RB",
                name: 'Mears',
                num: 4,
                x: 76,
                y: 52
            }
            },

            { data:{
                type: "LM",
                name: 'Neagle',
                num: 27,
                x: 1,
                y: 28
            }
            },
            { data: {
                type: "CAM",
                name: 'Pineda',
                num: 8,
                x: 26,
                y: 28
            }
            },
            { data:{
                type: "CDM",
                name: 'Alonso',
                num: 6,
                x: 51,
                y: 28
            }
            },
            { data:{
                type: "RM",
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


        self.edit = function() {
            if (self.state === 'new') {
                self.state = 'edit';
                $rootScope.$broadcast('changeState', {state: 'edit'});
                return;
            }

            if (self.state === 'edit') {
                $rootScope.$broadcast('changeState', {state: 'new'});
                self.state = 'new';
            }

        }

    });