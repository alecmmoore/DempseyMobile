dempsey.controller('miscController',
    function miscController($scope) {
        var self = this;
        self.state = 'new';

        self.saves = 0;
        self.corners = 0;
        self.offsides = 0;

        self.addProp = function(prop) {
            console.log(self[prop]);
            if (self.hasOwnProperty(prop)) {
                self[prop] += 1;
            }
        }

        self.subProp = function(prop) {
            if (self.hasOwnProperty(prop) && self[prop] > 0) {
                self[prop] -= 1;
            }
        }

        self.edit = function() {

        }

    });