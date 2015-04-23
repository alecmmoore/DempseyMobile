dempsey.controller('possessionController',
    function possessionController($scope) {
        var self = this;

        self.selected = 0;

        self.getSelected = function(_selected) {
            return _selected === self.selected;
        }

        self.setSelected = function(_selected) {
            self.selected = _selected;
        }


        $scope.possession = {
            data: 50
        }

    });