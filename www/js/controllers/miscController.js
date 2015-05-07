dempsey.controller('miscController',
    function miscController(dataService) {
        var self = this;
        self.state = 'new';

        self.opponentGoals = 0;
        self.saves = 0;
        self.corners = 0;
        self.offsides = 0;

        self.addProp = function(prop) {
            if (self.hasOwnProperty(prop)) {
                self[prop] += 1;
                dataService.setLocalGameStats(prop, self[prop], true);
            }
        }

        self.subProp = function(prop) {
            if (self.hasOwnProperty(prop) && self[prop] > 0) {
                self[prop] -= 1;
                dataService.setLocalGameStats(prop, self[prop], true);
            }
        };

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