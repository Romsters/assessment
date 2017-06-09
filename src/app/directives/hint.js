(function () {
    'use strict';
    
    angular.module('assessment').directive('hint', directive);

    directive.$inject = ['$compile', 'documentBlockHelper'];

    function directive($compile, documentBlockHelper) {
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {
                var unbind = $scope.$watch(attrs.hint, set);

                function set(newValue) {
                    if (!_.isUndefined(newValue)) {
                        var dataType = getLearningContentType(newValue);
                        switch(dataType){
                            case 'hotspot': {
							    var hotspotOnImage = HotspotStorage.create($(newValue)[0]);
                        
								$element.addClass('hotspot-on-image-container');
								$element.html(hotspotOnImage.element);
                                
								$element.on('$destroy', function () {
								    HotspotStorage.remove(hotspotOnImage);
								});
                                onHintCreated();
                                break;
                            }
                            case 'document': {
                                documentBlockHelper.getDocumentBlockContent(newValue).then(function(content) {
                                    $element.append(content);
                                    onHintCreated();
                                });
                                break;
                            }
                            default: {
                                $element.html(newValue);
                                onHintCreated();
                            }
                        }
                    }
                }

                function onHintCreated() {
                    $compile($element.contents())($scope);
                    $scope.$emit('$includeContentLoaded');
                    unbind();
                }
                
                function getLearningContentType(data){
                    var $output = $('<output>').html(data),
                        dataType = $('[data-type]', $output).attr('data-type');

                    return dataType;
                }
            }
        };
    }
}());