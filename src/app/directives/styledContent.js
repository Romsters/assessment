(function () {

    angular.module('assessment')
        .directive('styledContent', styledContent);

    function styledContent() {
        
        return {
            restrict: 'A',
            link: function ($scope, element) {
                var $element = $(element),
                    imageWrapper = '<div class="image-wrapper"></div>',
                    tableWrapper = '<div class="table-wrapper"></div>';
                $element.addClass('styled-content');

                $scope.$on('$includeContentLoaded', function () {

                    $('img', $element).each(function (index, image) {
                        var $image = $(image),
                            $wrapper = $(imageWrapper).css('float', $image.css('float'));

                        if ($image.closest('.cropped-image').length > 0) {
                            return;
                        }

                        $image.height('auto');
                        $image.css('float', 'none');
                        $image.wrap($wrapper);
                    });

                    $('table', $element).each(function (index, table) {
                        var $table = $(table),
                            $wrapper = $(tableWrapper).css('text-align', $table.attr('align'));
                        $table.attr('align', 'center');
                        $table.wrap($wrapper);
                    });

                    $('.audio-editor iframe', $element).each(function (index, iframe) {
                        var $iframe = $(iframe);

                        var src = $iframe.attr('src');
                        $iframe.attr('src', src + '&style_variables=' + encodeURIComponent(getStyles()));
                    });
 
                });
            }
        };
    }

    function getStyles() {
        return window.LessProcessor && window.LessProcessor.vars ? JSON.stringify({ '@main-color': window.LessProcessor.vars['@main-color'], '@content-body-color': window.LessProcessor.vars['@content-body-color'], '@text-color': window.LessProcessor.vars['@text-color'] }) : undefined;
    }
}());