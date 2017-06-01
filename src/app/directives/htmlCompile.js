(function () {
    'use strict';
    
    //Unlike ngBindHtml, this directive allows you to use nested bindings and emit event $includeContentLoaded.
    angular.module('assessment').directive('htmlCompile', directive);

    directive.$inject = ['$compile'];

    function directive($compile) {
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {
                var unbind = $scope.$watch(attrs.htmlCompile, set);

                function set(newValue) {
                    if (!_.isUndefined(newValue)) {
                        var dataType = getLearningContentType(newValue);
                        switch (dataType) {
                            case 'hotspot':
                                var hotspotOnImage = HotspotStorage.create($(newValue)[0]);

                                $element.addClass('hotspot-on-image-container');
                                $element.html(hotspotOnImage.element);

                                $element.on('$destroy', function () {
                                    HotspotStorage.remove(hotspotOnImage);
                                });
                                break;
                            default:
                                $element.html(newValue);
                        }
                        $compile($element.contents())($scope);
                        $scope.$emit('$includeContentLoaded');
                        unbind();
                    }
                }

                function getLearningContentType(data) {
                    var $output = $('<output>').html(data),
                        dataType = $('[data-type]', $output).attr('data-type');

                    return dataType;
                }
            }
        };
    }
}());
