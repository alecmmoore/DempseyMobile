dempsey.controller('homeController',
    function homeController($timeout, dataService) {
        var self = this;

        self.currentGame = {};

        self.init = (function() {
            $timeout(function() {
                self.currentGame = dataService.getLocalGame();
            });
        })();

    });