dempsey.controller('homeController',
    function homeController($scope, $timeout, dataService) {
        var self = this;

        self.currentGame = {};

        $scope.$on('$ionicView.enter', function(event) {
            $timeout(function() {
                self.currentGame = dataService.getLocalGame();
            });
        });

    });