(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('SingleSelectImage', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function SingleSelectImage(data) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, data, _protected);

            that.correctAnswerId = data.correctAnswerId;

            that.options = data.answers;

            function answer(selectedOptionId) {
                that.score = selectedOptionId === that.correctAnswerId ? 100 : 0;
            }
        };
    }

}());