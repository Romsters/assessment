(function () {

    angular
        .module('assessment')
        .controller('ImagePreviewController', ImagePreviewController);

    ImagePreviewController.$inject = ['$scope', '$rootScope', '$document', 'imagePreviewFactory'];

    function ImagePreviewController($scope, $rootScope, $document, imagePreviewFactory) {
        var that = this;

        that.imageUrl = undefined;
        that.visible = false;

        that.show = function (imageUrl) {
            that.visible = true;
            that.imageUrl = imageUrl;
            
            $document.on('keydown', escapeHandler);
        }

        that.hide = function () {
            that.visible = false;

            $document.off('keydown', escapeHandler);
        }

        var unbind = $rootScope.$on(imagePreviewFactory.showEventName, function (event, imageUrl) {
            that.show(imageUrl);
        });
        $scope.$on('$destroy', function(){
            that.hide();
            
            unbind();
        });

        function escapeHandler(event) {
            if(event.keyCode === 27) {
                that.hide();

                event.preventDefault();
                event.stopPropagation();
            }
        }
    }
}());