dempsey.controller('passesController',
    function passesController($scope, $rootScope) {
        var self = this;
        self.state = 'new';

        $scope.players = [
            {
                type: "GK",
                name: 'Frei',
                num: 24,
                x: 38,
                y: 76
            },
            {
                type: "CB",
                name: 'Gonzales',
                num: 12,
                x: 1,
                y: 52
            },
            {
                type: "CB",
                name: 'Marshall',
                num: 14,
                x: 26,
                y: 52
            },
            {
                type: "CB",
                name: 'Evans',
                num: 3,
                x: 51,
                y: 52
            },
            {
                type: "CB",
                name: 'Mears',
                num: 4,
                x: 76,
                y: 52
            },

            {
                type: "CM",
                name: 'Neagle',
                num: 27,
                x: 1,
                y: 28
            },
            {
                type: "CM",
                name: 'Pineda',
                num: 8,
                x: 26,
                y: 28
            },
            {
                type: "CM",
                name: 'Alonso',
                num: 6,
                x: 51,
                y: 28
            },
            {
                type: "CM",
                name: 'Pappa',
                num: 10,
                x: 76,
                y: 28
            },

            {
                type: "ST",
                name: 'Dempsey',
                num: 2,
                x: 26,
                y: 3
            },
            {
                type: "ST",
                name: 'Martins',
                num: 9,
                x: 51,
                y: 3
            },
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