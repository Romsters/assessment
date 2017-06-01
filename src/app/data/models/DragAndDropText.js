(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('DragAndDropText', factory);

    factory.$inject = ['Question'];

    function factory(Question) {

        return function DragAndDropText(data) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, data, _protected);

            that.background = data.background;
            that.dropspots = data.dropspots;

            function answer(spots) {
                var correct = 0;
                spots.forEach(function (spot) {
                    if (_.find(that.dropspots, function (dropspot) {
                        return dropspot.x === spot.x && dropspot.y === spot.y && dropspot.text === spot.text;
                    })) {
                        correct++;
                    }
                });

                that.score = (correct === that.dropspots.length) ? 100 : 0;
            }
        };

    }

}());