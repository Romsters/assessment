(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('ContentBlock', factory);

    function factory() {
        return function ContentBlock(id, contentUrl) {
            var that = this;

            that.id = id;
            that.contentUrl = contentUrl;
        };
    }
}());